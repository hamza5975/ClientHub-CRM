import { useEffect } from 'react';
import { Download, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Card, Button, Spinner } from '@/components/ui';
import Chart from '@/components/Chart';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLeads } from '@/store/slices/leadsSlice';
import { fetchDeals } from '@/store/slices/dealsSlice';

export default function Reports() {
  const dispatch = useAppDispatch();
  const { items: leads, status: leadsStatus } = useAppSelector((state) => state.leads);
  const { items: deals, status: dealsStatus } = useAppSelector((state) => state.deals);

  useEffect(() => {
    dispatch(fetchLeads());
    dispatch(fetchDeals());
  }, [dispatch]);

  const isLoading = leadsStatus === 'loading' || dealsStatus === 'loading';

  // Calculate stats
  const totalDeals = deals.length;
  const wonDeals = deals.filter((d) => d.stage === 'Won');
  const lostDeals = deals.filter((d) => d.stage === 'Lost');
  const winRate = totalDeals > 0 ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length || 1)) * 100) : 0;
  const totalRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const avgDealSize = wonDeals.length > 0 ? Math.round(totalRevenue / wonDeals.length) : 0;

  // Pipeline funnel data
  const funnelData = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'].map((stage) => ({
    name: stage,
    value: deals.filter((d) => d.stage === stage).length,
  }));

  // Revenue by stage
  const revenueByStage = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'].map((stage) => ({
    name: stage,
    value: deals.filter((d) => d.stage === stage).reduce((sum, d) => sum + d.value, 0),
  }));

  // Win/Loss analysis
  const winLossData = [
    { name: 'Won', value: wonDeals.length },
    { name: 'Lost', value: lostDeals.length },
    { name: 'Active', value: deals.filter((d) => !['Won', 'Lost'].includes(d.stage)).length },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Title', 'Company', 'Stage', 'Value', 'Probability', 'Close Date'],
      ...deals.map((d) => [
        d.title,
        d.company,
        d.stage,
        d.value,
        d.probability,
        d.expectedCloseDate || '',
      ]),
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deals-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div
        className="flex h-[calc(100vh-4rem)] items-center justify-center"
        data-icod-id="src_pages_reports_tsx_79af">
        <Spinner size="lg" data-icod-id="src_pages_reports_tsx_d94d" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-icod-id="src_pages_reports_tsx_fe4e">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        data-icod-id="src_pages_reports_tsx_a7f6">
        <div data-icod-id="src_pages_reports_tsx_c907">
          <h1
            className="text-2xl font-bold text-foreground"
            data-icod-id="src_pages_reports_tsx_d678">Reports</h1>
          <p
            className="text-muted-foreground"
            data-icod-id="src_pages_reports_tsx_7652">Sales analytics and performance metrics</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportCSV}
          data-icod-id="src_pages_reports_tsx_ad80">
          <Download className="h-4 w-4" data-icod-id="src_pages_reports_tsx_f42a" />
          Export CSV
        </Button>
      </div>
      {/* Key Metrics */}
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        data-icod-id="src_pages_reports_tsx_9d77">
        <Card
          className="flex items-center gap-4 p-4"
          data-icod-id="src_pages_reports_tsx_22de">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
            data-icod-id="src_pages_reports_tsx_f86f">
            <Target className="h-6 w-6" data-icod-id="src_pages_reports_tsx_de4e" />
          </div>
          <div data-icod-id="src_pages_reports_tsx_346c">
            <p
              className="text-sm text-muted-foreground"
              data-icod-id="src_pages_reports_tsx_85a1">Win Rate</p>
            <p
              className="text-2xl font-bold text-foreground"
              data-icod-id="src_pages_reports_tsx_df06">{winRate}%</p>
          </div>
        </Card>

        <Card
          className="flex items-center gap-4 p-4"
          data-icod-id="src_pages_reports_tsx_e7aa">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-600"
            data-icod-id="src_pages_reports_tsx_23e1">
            <DollarSign className="h-6 w-6" data-icod-id="src_pages_reports_tsx_73d1" />
          </div>
          <div data-icod-id="src_pages_reports_tsx_0595">
            <p
              className="text-sm text-muted-foreground"
              data-icod-id="src_pages_reports_tsx_c492">Total Revenue</p>
            <p
              className="text-2xl font-bold text-foreground"
              data-icod-id="src_pages_reports_tsx_7cc6">{formatCurrency(totalRevenue)}</p>
          </div>
        </Card>

        <Card
          className="flex items-center gap-4 p-4"
          data-icod-id="src_pages_reports_tsx_6b73">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600"
            data-icod-id="src_pages_reports_tsx_ebf8">
            <TrendingUp className="h-6 w-6" data-icod-id="src_pages_reports_tsx_35b4" />
          </div>
          <div data-icod-id="src_pages_reports_tsx_4087">
            <p
              className="text-sm text-muted-foreground"
              data-icod-id="src_pages_reports_tsx_5b8d">Avg Deal Size</p>
            <p
              className="text-2xl font-bold text-foreground"
              data-icod-id="src_pages_reports_tsx_1df5">{formatCurrency(avgDealSize)}</p>
          </div>
        </Card>

        <Card
          className="flex items-center gap-4 p-4"
          data-icod-id="src_pages_reports_tsx_f030">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600"
            data-icod-id="src_pages_reports_tsx_652f">
            <Target className="h-6 w-6" data-icod-id="src_pages_reports_tsx_e055" />
          </div>
          <div data-icod-id="src_pages_reports_tsx_29d8">
            <p
              className="text-sm text-muted-foreground"
              data-icod-id="src_pages_reports_tsx_a36c">Total Deals</p>
            <p
              className="text-2xl font-bold text-foreground"
              data-icod-id="src_pages_reports_tsx_4c40">{totalDeals}</p>
          </div>
        </Card>
      </div>
      {/* Charts */}
      <div
        className="grid gap-6 lg:grid-cols-2"
        data-icod-id="src_pages_reports_tsx_9562">
        <Chart
          type="bar"
          data={funnelData}
          xKey="name"
          yKeys={['value']}
          title="Sales Pipeline Funnel"
          colors={['#3B82F6']}
          data-icod-id="src_pages_reports_tsx_8568" />
        <Chart
          type="pie"
          data={winLossData}
          xKey="name"
          yKeys={['value']}
          title="Win/Loss Analysis"
          colors={['#10B981', '#EF4444', '#F59E0B']}
          data-icod-id="src_pages_reports_tsx_d4f6" />
      </div>
      <Chart
        type="bar"
        data={revenueByStage}
        xKey="name"
        yKeys={['value']}
        title="Revenue by Stage"
        colors={['#3B82F6']}
        className="w-full"
        data-icod-id="src_pages_reports_tsx_77dd" />
      {/* Top Performers Table */}
      <Card className="p-4" data-icod-id="src_pages_reports_tsx_8354">
        <h3
          className="mb-4 text-lg font-semibold text-foreground"
          data-icod-id="src_pages_reports_tsx_8e26">Deals Overview</h3>
        <div className="overflow-x-auto" data-icod-id="src_pages_reports_tsx_7cba">
          <table className="w-full text-sm" data-icod-id="src_pages_reports_tsx_183d">
            <thead
              className="border-b border-border bg-muted/50"
              data-icod-id="src_pages_reports_tsx_6fc8">
              <tr data-icod-id="src_pages_reports_tsx_9d1e">
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                  data-icod-id="src_pages_reports_tsx_0163">Title</th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                  data-icod-id="src_pages_reports_tsx_298f">Company</th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                  data-icod-id="src_pages_reports_tsx_7a51">Stage</th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                  data-icod-id="src_pages_reports_tsx_933c">Value</th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground"
                  data-icod-id="src_pages_reports_tsx_72d5">Probability</th>
              </tr>
            </thead>
            <tbody
              className="divide-y divide-border"
              data-icod-id="src_pages_reports_tsx_6a36">
              {deals.slice(0, 10).map((deal) => (
                <tr
                  key={deal._id}
                  className="hover:bg-muted/30"
                  data-icod-id={`src_pages_reports_tsx_e800_${deal._id}`}>
                  <td
                    className="px-4 py-3 font-medium text-foreground"
                    data-icod-id={`src_pages_reports_tsx_908b_${deal._id}`}>{deal.title}</td>
                  <td
                    className="px-4 py-3 text-muted-foreground"
                    data-icod-id={`src_pages_reports_tsx_d983_${deal._id}`}>{deal.company}</td>
                  <td
                    className="px-4 py-3"
                    data-icod-id={`src_pages_reports_tsx_1934_${deal._id}`}>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        deal.stage === 'Won' ? 'bg-green-100 text-green-800' :
                        deal.stage === 'Lost' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                      data-icod-id={`src_pages_reports_tsx_90bc_${deal._id}`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-foreground"
                    data-icod-id={`src_pages_reports_tsx_ad62_${deal._id}`}>{formatCurrency(deal.value)}</td>
                  <td
                    className="px-4 py-3 text-muted-foreground"
                    data-icod-id={`src_pages_reports_tsx_61c8_${deal._id}`}>{deal.probability}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
