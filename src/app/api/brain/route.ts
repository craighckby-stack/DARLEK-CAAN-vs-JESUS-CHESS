import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ── BRAIN PERSISTENCE ──────────────────────────────────────────────
// DARLEK CANN stores session state, mutation history, rejections,
// and health snapshots so nothing is lost across page refreshes.
// ───────────────────────────────────────────────────────────────────

// Create a new session or return the latest active one
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'create-session': {
        const { branch } = body;
        const session = await db.session.create({
          data: {
            branch: branch || 'ALPHA',
            status: 'active',
          },
        });
        return NextResponse.json({ success: true, session });
      }

      case 'get-active-session': {
        const active = await db.session.findFirst({
          where: { status: 'active' },
          orderBy: { startedAt: 'desc' },
        });
        return NextResponse.json({ success: true, session: active });
      }

      case 'record-mutation': {
        const { sessionId, filePath, fileSha, originalCode, proposedCode, analysis, riskScore, affectedFiles, status, commitSha, provider, debateResult, impactResult, errorMessage } = body;
        if (!sessionId || !filePath) {
          return NextResponse.json({ error: 'sessionId and filePath required' }, { status: 400 });
        }
        const mutation = await db.mutationHistory.create({
          data: {
            sessionId,
            filePath,
            fileSha: fileSha || '',
            originalCode: (originalCode || '').slice(0, 50000),
            proposedCode: (proposedCode || '').slice(0, 50000),
            analysis: analysis || '',
            riskScore: riskScore || 5,
            affectedFiles: JSON.stringify(affectedFiles || []),
            status: status || 'pending',
            commitSha: commitSha || '',
            provider: provider || '',
            debateResult: JSON.stringify(debateResult || {}),
            impactResult: JSON.stringify(impactResult || {}),
            errorMessage: errorMessage || '',
          },
        });
        // Update session counter
        if (status === 'applied') {
          await db.session.update({ where: { id: sessionId }, data: { mutationsApplied: { increment: 1 }, evolutionCycle: { increment: 1 } } });
        } else if (status === 'rejected') {
          await db.session.update({ where: { id: sessionId }, data: { mutationsRejected: { increment: 1 } } });
        }
        return NextResponse.json({ success: true, mutation });
      }

      case 'record-rejection': {
        const { sessionId, filePath, reason, analysis, riskScore, patternTags } = body;
        if (!sessionId || !filePath) {
          return NextResponse.json({ error: 'sessionId and filePath required' }, { status: 400 });
        }
        const rejection = await db.rejectionRecord.create({
          data: {
            sessionId,
            filePath,
            reason: reason || '',
            analysis: analysis || '',
            riskScore: riskScore || 5,
            patternTags: JSON.stringify(patternTags || []),
          },
        });
        return NextResponse.json({ success: true, rejection });
      }

      case 'record-health': {
        const { sessionId, metrics, overallHealth } = body;
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }
        const snapshot = await db.healthSnapshot.create({
          data: {
            sessionId,
            structuralChange: metrics?.structuralChange || 0,
            semanticSaturation: metrics?.semanticSaturation || 0,
            velocity: metrics?.velocity || 0,
            identityPreservation: metrics?.identityPreservation || 1,
            capabilityAlignment: metrics?.capabilityAlignment || 0,
            crossFileImpact: metrics?.crossFileImpact || 0,
            overallHealth: overallHealth || 'healthy',
          },
        });
        await db.session.update({ where: { id: sessionId }, data: { overallHealth: overallHealth || 'healthy' } });
        return NextResponse.json({ success: true, snapshot });
      }

      case 'get-latest-applied-mutation': {
        const { sessionId } = body;
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }
        const mutation = await db.mutationHistory.findFirst({
          where: { sessionId, status: 'applied' },
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ success: true, mutation });
      }

      case 'update-mutation-status': {
        const { mutationId, status, sessionId } = body;
        if (!mutationId || !status) {
          return NextResponse.json({ error: 'mutationId and status required' }, { status: 400 });
        }
        const updated = await db.mutationHistory.update({
          where: { id: mutationId },
          data: { status },
        });
        if (status === 'reverted' && sessionId) {
          await db.session.update({
            where: { id: sessionId },
            data: {
              mutationsApplied: { decrement: 1 },
              evolutionCycle: { increment: 1 },
            },
          }).catch(() => {});
        }
        return NextResponse.json({ success: true, mutation: updated });
      }

      case 'get-mutation-history': {
        const { sessionId, limit } = body;
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }
        const mutations = await db.mutationHistory.findMany({
          where: { sessionId },
          orderBy: { createdAt: 'desc' },
          take: limit || 50,
        });
        return NextResponse.json({ success: true, mutations });
      }

      case 'get-rejection-history': {
        const { sessionId } = body;
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }
        const rejections = await db.rejectionRecord.findMany({
          where: { sessionId },
          orderBy: { createdAt: 'desc' },
          take: 50,
        });
        return NextResponse.json({ success: true, rejections });
      }

      case 'get-stats': {
        const { sessionId } = body;
        const where = sessionId ? { id: sessionId } : {};
        const session = await db.session.findFirst({
          where,
          orderBy: { startedAt: 'desc' },
          include: {
            _count: { select: { mutations: true, rejections: true, healthChecks: true } },
          },
        });
        return NextResponse.json({ success: true, session });
      }

      case 'close-session': {
        const { sessionId } = body;
        if (!sessionId) {
          return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
        }
        const closed = await db.session.update({
          where: { id: sessionId },
          data: { status: 'completed' },
        });
        return NextResponse.json({ success: true, session: closed });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error('BRAIN API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


