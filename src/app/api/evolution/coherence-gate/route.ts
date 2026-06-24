import { NextRequest, NextResponse } from 'next/server';
import type { CoherenceGateResult } from '@/lib/types';
import { SATURATION_THRESHOLDS } from '@/lib/constants';

interface CoherenceGateBody {
  riskScore: number;
  saturation: {
    structuralChange: number;
    semanticSaturation: number;
    velocity: number;
    identityPreservation: number;
    capabilityAlignment: number;
    crossFileImpact: number;
  };
  affectedFiles: string[];
  bypassGate?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: CoherenceGateBody = await req.json();
    const { riskScore, saturation, affectedFiles, bypassGate } = body;

    if (bypassGate) {
      return NextResponse.json({
        passed: true,
        reason: 'COHERENCE GATE PASSED: Bypassed by system-level AUTO-APPROVE settings.',
        riskScore,
        saturationWarning: false,
      });
    }

    const failures: string[] = [];
    let saturationWarning = false;

    // Rule 1: Risk score check — block anything above 7
    const RISK_THRESHOLD = 7;
    if (riskScore > RISK_THRESHOLD) {
      failures.push(`Risk score ${riskScore}/10 exceeds maximum threshold ${RISK_THRESHOLD}. Mutation DENIED.`);
    }

    // Rule 2: Saturation thresholds — check each metric
    const checks = [
      {
        name: 'Structural Change',
        value: saturation.structuralChange,
        threshold: SATURATION_THRESHOLDS.structuralChange.critical,
        max: SATURATION_THRESHOLDS.structuralChange.max,
      },
      {
        name: 'Semantic Saturation',
        value: saturation.semanticSaturation,
        threshold: SATURATION_THRESHOLDS.semanticSaturation.critical,
        max: SATURATION_THRESHOLDS.semanticSaturation.max,
      },
      {
        name: 'Velocity',
        value: saturation.velocity,
        threshold: SATURATION_THRESHOLDS.velocity.critical,
        max: SATURATION_THRESHOLDS.velocity.max,
      },
      {
        name: 'Identity Preservation',
        value: saturation.identityPreservation,
        threshold: SATURATION_THRESHOLDS.identityPreservation.critical,
        max: SATURATION_THRESHOLDS.identityPreservation.max,
        inverted: true,
      },
      {
        name: 'Cross-File Impact',
        value: saturation.crossFileImpact,
        threshold: SATURATION_THRESHOLDS.crossFileImpact.critical,
        max: SATURATION_THRESHOLDS.crossFileImpact.max,
      },
    ];

    for (const check of checks) {
      const isOver = check.inverted
        ? check.value <= check.threshold
        : check.value >= check.threshold;

      if (isOver) {
        failures.push(`${check.name} at critical level (${check.value}/${check.max}). System cannot absorb more change.`);
        saturationWarning = true;
      }
    }

    // Rule 3: Cross-file impact — warn if many files affected
    if (affectedFiles.length > 5) {
      failures.push(`Mutation affects ${affectedFiles.length} files — exceeds safe cross-file impact limit of 5.`);
      saturationWarning = true;
    }

    // Rule 4: Cumulative saturation stress — if 3+ metrics at warning level
    const warningChecks = [
      saturation.structuralChange >= SATURATION_THRESHOLDS.structuralChange.warning,
      saturation.semanticSaturation >= SATURATION_THRESHOLDS.semanticSaturation.warning,
      saturation.velocity >= SATURATION_THRESHOLDS.velocity.warning,
      saturation.identityPreservation <= SATURATION_THRESHOLDS.identityPreservation.warning,
      saturation.crossFileImpact >= SATURATION_THRESHOLDS.crossFileImpact.warning,
    ];
    const warningCount = warningChecks.filter(Boolean).length;
    if (warningCount >= 3) {
      failures.push(`Cumulative stress: ${warningCount}/5 metrics at warning level. System needs rest.`);
      saturationWarning = true;
    }

    const result: CoherenceGateResult = {
      passed: failures.length === 0,
      reason: failures.length > 0
        ? `COHERENCE GATE BLOCKED:\n${failures.join('\n')}`
        : 'COHERENCE GATE PASSED: All thresholds within safe limits. Mutation authorized.',
      riskScore,
      saturationWarning,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Coherence gate error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { passed: false, reason: `Coherence gate error: ${errorMessage}`, riskScore: 0, saturationWarning: true },
      { status: 500 }
    );
  }
}


