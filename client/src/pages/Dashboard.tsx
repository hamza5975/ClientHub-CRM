import { useEffect } from 'react';
import { Users, TrendingUp, DollarSign, CheckSquare } from 'lucide-react';
import { Card, Spinner } from '@/components/ui';
import Chart from '@/components/Chart';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLeads } from '@/store/slices/leadsSlice';
import { fetchDeals } from '@/store/slices/dealsSlice';
import { fetchTasks } from '@/store/slices/tasksSlice';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { items: leads, status: leadsStatus } = useAppSelector((state) => state.leads);
  const { items: deals, status: dealsStatus } = useAppSelector((state) => state.deals);
  const { items: tasks, status: tasksStatus } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchLeads());
    dispatch(fetchDeals());
    dispatch(fetchTasks());
  }, [dispatch]);

  const isLoading = leadsStatus === 'loading' || dealsStatus === 'loading' || tasksStatus === 'loading';

  // Calculate stats
  const totalLeads = leads.length;
  const activeDeals = deals.filter((d) => !['Won', 'Lost'].includes(d.stage)).length;
  const totalRevenue = deals.filter((d) => d.stage === 'Won').reduce((sum, d) => sum + d.value, 0);
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

  // Prepare chart data
  const stageData = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'].map((stage) => ({
    name: stage,
    leads: leads.filter((l) => l.stage === stage).length,
    deals: deals.filter((d) => d.stage === stage).length,
  }));

  const revenueByStage = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'].map((stage) => ({
    name: stage,
    value: deals.filter((d) => d.stage === stage).reduce((sum, d) => sum + d.value, 0),
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  if (isLoading) {
    return (
      <div
        className="flex h-[calc(100vh-4rem)] items-center justify-center"
        data-icod-id="src_pages_dashboard_tsx_06d6">
        <Spinner size="lg" data-icod-id="src_pages_dashboard_tsx_f87a" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-icod-id="src_pages_dashboard_tsx_f395">
      <div data-icod-id="src_pages_dashboard_tsx_e7fc">
        <h1
          className="text-2xl font-bold text-foreground"
          data-icod-id="src_pages_dashboard_tsx_0112">Dashboard</h1>
        <p
          className="text-muted-foreground"
          data-icod-id="src_pages_dashboard_tsx_2cb3">Overview of your CRM performance</p>
      </div>
      {/* Stats Cards */}
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        data-icod-id="src_pages_dashboard_tsx_a67a">
        <Card
          className="flex items-center gap-4 p-4"
          data-icod-id="src_pages_dashboard_tsx_8f30">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
            data-icod-id="src_pages_dashboard_tsx_64e7">
            <Users className="h-6 w-6" data-icod-id="src_pages_dashboard_tsx_15b9" />
          </div>
          <div data-icod-id="src_pages_dashboard_tsx_a07c">
            <p
              className="text-sm text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_5bf6">Total Leads</p>
            <p
              className="text-2xl font-bold text-foreground"
              data-icod-id="src_pages_dashboard_tsx_e46a">{totalLeads}</p>
          </div>
        </Card>

        <Card
          className="flex items-center gap-4 p-4"
          data-icod-id="src_pages_dashboard_tsx_4aa1">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600"
            data-icod-id="src_pages_dashboard_tsx_feef">
            <TrendingUp className="h-6 w-6" data-icod-id="src_pages_dashboard_tsx_dbb7" />
          </div>
          <div data-icod-id="src_pages_dashboard_tsx_173e">
            <p
              className="text-sm text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_fb0e">Active Deals</p>
            <p
              className="text-2xl font-bold text-foreground"
              data-icod-id="src_pages_dashboard_tsx_2279">{activeDeals}</p>
          </div>
        </Card>

        <Card
          className="flex items-center gap-4 p-4"
          data-icod-id="src_pages_dashboard_tsx_651f">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600"
            data-icod-id="src_pages_dashboard_tsx_55c0">
            <DollarSign className="h-6 w-6" data-icod-id="src_pages_dashboard_tsx_ac15" />
          </div>
          <div data-icod-id="src_pages_dashboard_tsx_f28f">
            <p
              className="text-sm text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_d00f">Won Revenue</p>
            <p
              className="text-2xl font-bold text-foreground"
              data-icod-id="src_pages_dashboard_tsx_8dcc">{formatCurrency(totalRevenue)}</p>
          </div>
        </Card>

        <Card
          className="flex items-center gap-4 p-4"
          data-icod-id="src_pages_dashboard_tsx_521f">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600"
            data-icod-id="src_pages_dashboard_tsx_d58d">
            <CheckSquare className="h-6 w-6" data-icod-id="src_pages_dashboard_tsx_2157" />
          </div>
          <div data-icod-id="src_pages_dashboard_tsx_efad">
            <p
              className="text-sm text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_ef27">Pending Tasks</p>
            <p
              className="text-2xl font-bold text-foreground"
              data-icod-id="src_pages_dashboard_tsx_c9af">{pendingTasks}</p>
          </div>
        </Card>
      </div>
      {/* Charts */}
      <div
        className="grid gap-6 lg:grid-cols-2"
        data-icod-id="src_pages_dashboard_tsx_4da9">
        <Chart
          type="line"
          data={stageData}
          xKey="name"
          yKeys={['leads', 'deals']}
          title="Pipeline Overview"
          colors={['#3B82F6', '#10B981']}
          data-icod-id="src_pages_dashboard_tsx_1025" />
        <Chart
          type="bar"
          data={revenueByStage}
          xKey="name"
          yKeys={['value']}
          title="Revenue by Stage"
          colors={['#3B82F6']}
          data-icod-id="src_pages_dashboard_tsx_ef3c" />
      </div>
      {/* Recent Activity */}
      <Card className="p-4" data-icod-id="src_pages_dashboard_tsx_3b4d">
        <h3
          className="mb-4 text-lg font-semibold text-foreground"
          data-icod-id="src_pages_dashboard_tsx_3baa">Recent Leads</h3>
        <div className="space-y-3" data-icod-id="src_pages_dashboard_tsx_006c">
          {leads.slice(0, 5).map((lead) => (
            <div
              key={lead._id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              data-icod-id={`src_pages_dashboard_tsx_2fbe_${lead._id}`}>
              <div data-icod-id={`src_pages_dashboard_tsx_dc15_${lead._id}`}>
                <p
                  className="font-medium text-foreground"
                  data-icod-id={`src_pages_dashboard_tsx_2449_${lead._id}`}>{lead.title}</p>
                <p
                  className="text-sm text-muted-foreground"
                  data-icod-id={`src_pages_dashboard_tsx_566a_${lead._id}`}>{lead.company}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  lead.stage === 'Won' ? 'bg-green-100 text-green-800' :
                  lead.stage === 'Lost' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}
                data-icod-id={`src_pages_dashboard_tsx_8567_${lead._id}`}>
                {lead.stage}
              </span>
            </div>
          ))}
          {leads.length === 0 && (
            <p
              className="text-center text-muted-foreground"
              data-icod-id="src_pages_dashboard_tsx_cce2">No leads yet</p>
          )}
        </div>
      </Card>
    </div>
  );
}
