import { NeuralCodec, minifyCode } from './neural_codec';

/**
 * BRAIN-FIREBASE-RUNTIME: Core State Machine & DNA Substrate
 * Implements an asynchronous lifecycle-aware state machine with atomic mutation logic.
 */

export enum BrainState {
  OFFLINE = 'OFFLINE',
  BOOTING = 'BOOTING',
  IDLE = 'IDLE',
  MUTATING = 'MUTATING',
  SYNCHRONIZING = 'SYNCHRONIZING',
  EVOLVING = 'EVOLVING',
  ERROR = 'ERROR',
}

export interface BrainChunk {
  path: string;
  content: string;
  version: number;
  lastModified: number;
  hash?: string;
}

export interface PersistenceStrategy {
  save(payload: string): Promise<void>;
  load(): Promise<string | null>;
  name: string;
}

export interface BrainConfig {
  strategy?: PersistenceStrategy;
  shield?: any;
  mutationTimeout?: number;
}

/**
 * BrainTransaction: Ensures atomicity of DNA mutations.
 */
export class BrainTransaction {
  private mutations: Map<string, string | null> = new Map();
  private committed: boolean = false;
  public readonly id: string = Math.random().toString(36).substring(2, 15);

  update(path: string, content: string): this {
    if (this.committed) throw new Error('Transaction sealed');
    if (!path || typeof content !== 'string') {
      throw new Error('Invalid mutation parameters');
    }
    this.mutations.set(path, content);
    return this;
  }

  delete(path: string): this {
    if (this.committed) throw new Error('Transaction sealed');
    if (!path) {
      throw new Error('Invalid path for deletion');
    }
    this.mutations.set(path, null);
    return this;
  }

  getMutations(): ReadonlyMap<string, string | null> {
    return this.mutations;
  }

  commit(): void {
    this.committed = true;
  }

  isCommitted(): boolean {
    return this.committed;
  }
}

/**
 * Brain: The Autonomous Code Architect Core.
 * Manages the "Hybrid Mind" state and DNA persistence.
 */
export class Brain extends EventTarget {
  private _state: BrainState = BrainState.OFFLINE;
  private _substrate: Map<string, BrainChunk> = new Map();
  private _binarySubstrate: Uint8Array | null = null;
  private _version: number = 0;
  private _strategy: PersistenceStrategy | null = null;
  private _shield: any = null;
  private _lock: boolean = false;
  private _mutationTimeout: number;
  private _timeoutId: NodeJS.Timeout | null = null;

  constructor(config: BrainConfig = {}) {
    super();
    this._strategy = config.strategy || null;
    this._shield = config.shield || null;
    this._mutationTimeout = config.mutationTimeout || 30000; // Default 30 seconds
    this.transition(BrainState.BOOTING);
  }

  get state(): BrainState {
    return this._state;
  }

  get version(): number {
    return this._version;
  }

  private transition(newState: BrainState): void {
    const oldState = this._state;
    this._state = newState;
    this.dispatchEvent(
      new CustomEvent('state_change', {
        detail: { from: oldState, to: newState, timestamp: Date.now() },
      })
    );
  }

  /**
   * Initializes the brain from a persistence layer.
   */
  async initialize(): Promise<void> {
    if (!this._strategy) {
      this.transition(BrainState.IDLE);
      return;
    }

    try {
      this.transition(BrainState.SYNCHRONIZING);
      const payload = await this._strategy.load();
      if (payload) {
        await this.ingest(payload);
      }
      this.transition(BrainState.IDLE);
    } catch (error) {
      this.transition(BrainState.ERROR);
      throw new Error(`Brain initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Decodes and maps the DNA into the virtual substrate.
   */
  async ingest(payload: string): Promise<void> {
    if (!payload) {
      throw new Error('Payload cannot be empty');
    }

    try {
      const decoded = await NeuralCodec.decode(payload, this._shield);
      if (!Array.isArray(decoded)) {
        throw new Error('Decoded payload is not an array');
      }

      this._substrate.clear();
      const now = Date.now();
      
      for (const chunk of decoded) {
        if (!chunk.path || typeof chunk.content !== 'string') {
          throw new Error('Invalid chunk structure');
        }
        this._substrate.set(chunk.path, {
          path: chunk.path,
          content: chunk.content,
          version: this._version,
          lastModified: now,
        });
      }

      this._binarySubstrate = this.base64ToBuffer(payload);
      this._version++;
      this.dispatchEvent(
        new CustomEvent('mutation', { detail: { type: 'INGEST', version: this._version } })
      );
    } catch (error) {
      console.error('Substrate Ingestion Failure:', error);
      throw new Error(`Ingestion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Executes a transaction atomically.
   */
  async execute(tx: BrainTransaction): Promise<void> {
    if (this._lock) {
      throw new Error('Brain is currently mutating');
    }
    
    if (!tx || tx.isCommitted()) {
      throw new Error('Invalid transaction');
    }

    this._lock = true;
    this.transition(BrainState.MUTATING);
    
    // Set mutation timeout
    this._timeoutId = setTimeout(() => {
      this.handleMutationTimeout();
    }, this._mutationTimeout);

    try {
      tx.commit();
      const mutations = tx.getMutations();

      for (const [path, content] of mutations.entries()) {
        if (content === null) {
          this._substrate.delete(path);
        } else {
          const minified = minifyCode(content, path);
          this._substrate.set(path, {
            path,
            content: minified,
            version: this._version + 1,
            lastModified: Date.now(),
          });
        }
      }

      this._version++;
      this._binarySubstrate = null; // Invalidate cache

      if (this._strategy) {
        const payload = await this.export();
        await this._strategy.save(payload);
      }

      this.dispatchEvent(
        new CustomEvent('mutation', {
          detail: { type: 'COMMIT', txId: tx.id, version: this._version },
        })
      );

      this.transition(BrainState.IDLE);
    } catch (error) {
      this.transition(BrainState.ERROR);
      throw new Error(`Transaction execution failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      this._lock = false;
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
      }
    }
  }

  private handleMutationTimeout(): void {
    console.warn('Mutation operation timed out');
    this._lock = false;
    this.transition(BrainState.ERROR);
  }

  /**
   * Exports the current substrate to a compressed DNA payload.
   */
  async export(): Promise<string> {
    const chunks = Array.from(this._substrate.values()).map((c) => ({
      path: c.path,
      content: c.content,
    }));
    
    if (chunks.length === 0) {
      return '';
    }
    
    return await NeuralCodec.encode(chunks, this._shield);
  }

  /**
   * Returns the full substrate as an array of chunks.
   */
  getChunks(): BrainChunk[] {
    return Array.from(this._substrate.values());
  }

  /**
   * Returns a specific chunk by path.
   */
  getChunk(path: string): BrainChunk | undefined {
    if (!path) {
      throw new Error('Path cannot be empty');
    }
    return this._substrate.get(path);
  }

  /**
   * Forces a binary rebuild of the system state.
   */
  async globalRefactor(): Promise<void> {
    this.transition(BrainState.EVOLVING);
    try {
      const payload = await this.export();
      await this.ingest(payload);
      this.transition(BrainState.IDLE);
    } catch (error) {
      this.transition(BrainState.ERROR);
      throw new Error(`Global refactor failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Deterministic synchronization: Ensures the local substrate matches a provided payload.
   */
  async synchronize(payload: string): Promise<void> {
    if (!payload) {
      throw new Error('Payload cannot be empty');
    }

    this.transition(BrainState.SYNCHRONIZING);
    try {
      await this.ingest(payload);
      this.transition(BrainState.IDLE);
    } catch (error) {
      this.transition(BrainState.ERROR);
      throw new Error(`Synchronization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private base64ToBuffer(base64: string): Uint8Array {
    try {
      const bin = atob(base64.replace(/\s/g, ''));
      const buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        buf[i] = bin.charCodeAt(i);
      }
      return buf;
    } catch (error) {
      console.warn('Buffer conversion warning:', error);
      return new Uint8Array(0);
    }
  }

  /**
   * Provides the raw binary state for cryptographic signatures or transport.
   */
  async getBinarySubstrate(): Promise<Uint8Array> {
    if (!this._binarySubstrate) {
      const payload = await this.export();
      this._binarySubstrate = this.base64ToBuffer(payload);
    }
    return this._binarySubstrate;
  }

  /**
   * Clears the brain state and resets to initial conditions.
   */
  async reset(): Promise<void> {
    this._substrate.clear();
    this._binarySubstrate = null;
    this._version = 0;
    this._lock = false;
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    this.transition(BrainState.IDLE);
  }
}

// Global utilities for direct DNA manipulation
export const packDNA = NeuralCodec.encode.bind(NeuralCodec);
export const unpackDNA = NeuralCodec.decode.bind(NeuralCodec);
export { NeuralCodec, minifyCode };
