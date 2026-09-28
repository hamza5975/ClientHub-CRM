import { type LeadStage, type DealStage } from '@/types';
import { cn } from '@/utils/cn';

type Stage = LeadStage | DealStage;

const stageColors: Record<Stage, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-purple-100 text-purple-800',
  Proposal: 'bg-orange-100 text-orange-800',
  Won: 'bg-green-100 text-green-800',
  Lost: 'bg-red-100 text-red-800',
};

interface StageBadgeProps {
  stage: Stage;
  className?: string;
}

export default function StageBadge({ stage, className }: StageBadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', stageColors[stage], className)}
      data-icod-id="src_components_stagebadge_tsx_1535">
      {stage}
    </span>
  );
}
