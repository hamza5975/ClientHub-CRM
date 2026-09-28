import { useState, useRef } from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { Deal, DealStage } from '@/types';

const STAGES: DealStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

interface KanbanBoardProps {
  deals: Deal[];
  onDealMove: (dealId: string, newStage: DealStage) => void;
  onDealClick?: (deal: Deal) => void;
  className?: string;
}

export default function KanbanBoard({
  deals,
  onDealMove,
  onDealClick,
  className,
}: KanbanBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDeal(dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    if (draggedDeal) {
      onDealMove(draggedDeal, stage);
      setDraggedDeal(null);
    }
  };

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div
      className={cn('flex gap-4 overflow-x-auto pb-4', className)}
      data-icod-id="src_components_kanbanboard_tsx_f406">
      {STAGES.map((stage) => {
        const stageDeals = getDealsByStage(stage);
        const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

        return (
          <div
            key={stage}
            className="flex min-w-[280px] flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
            data-icod-id={`src_components_kanbanboard_tsx_8323_${stage}`}>
            <Card
              className="flex flex-col gap-3 bg-muted/30 p-3"
              data-icod-id={`src_components_kanbanboard_tsx_331a_${stage}`}>
              <div
                className="flex items-center justify-between"
                data-icod-id={`src_components_kanbanboard_tsx_15db_${stage}`}>
                <h3
                  className="font-semibold text-foreground"
                  data-icod-id={`src_components_kanbanboard_tsx_894c_${stage}`}>{stage}</h3>
                <span
                  className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  data-icod-id={`src_components_kanbanboard_tsx_6246_${stage}`}>
                  {stageDeals.length}
                </span>
              </div>
              <p
                className="text-xs text-muted-foreground"
                data-icod-id={`src_components_kanbanboard_tsx_5f76_${stage}`}>
                Total: {formatCurrency(totalValue)}
              </p>
            </Card>
            <div
              className="mt-2 flex flex-1 flex-col gap-2"
              data-icod-id={`src_components_kanbanboard_tsx_df53_${stage}`}>
              {stageDeals.map((deal) => (
                <Card
                  key={deal._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal._id)}
                  onClick={() => onDealClick?.(deal)}
                  className={cn(
                    'cursor-grab p-3 transition-shadow hover:shadow-md active:cursor-grabbing',
                    draggedDeal === deal._id && 'opacity-50'
                  )}
                  data-icod-id={`src_components_kanbanboard_tsx_9797_${stage}_${deal._id}`}>
                  <h4
                    className="mb-1 font-medium text-foreground"
                    data-icod-id={`src_components_kanbanboard_tsx_7600_${stage}_${deal._id}`}>{deal.title}</h4>
                  <p
                    className="mb-2 text-sm text-muted-foreground"
                    data-icod-id={`src_components_kanbanboard_tsx_5d5f_${stage}_${deal._id}`}>{deal.company}</p>
                  <div
                    className="flex items-center justify-between text-xs"
                    data-icod-id={`src_components_kanbanboard_tsx_cfad_${stage}_${deal._id}`}>
                    <span
                      className="font-medium text-foreground"
                      data-icod-id={`src_components_kanbanboard_tsx_9721_${stage}_${deal._id}`}>{formatCurrency(deal.value)}</span>
                    <span
                      className="text-muted-foreground"
                      data-icod-id={`src_components_kanbanboard_tsx_5eab_${stage}_${deal._id}`}>{deal.probability}% prob</span>
                  </div>
                  {deal.expectedCloseDate && (
                    <p
                      className="mt-1 text-xs text-muted-foreground"
                      data-icod-id={`src_components_kanbanboard_tsx_59a5_${stage}_${deal._id}`}>
                      Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
