import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import {
  ArrowClockwise,
  ArrowRight,
  Briefcase,
  CashStack,
  ChatSquareText,
  ExclamationTriangleFill,
  PlusLg,
  Receipt,
  Truck,
  Wallet2,
} from "react-bootstrap-icons";
import apiAuth from "../../helpers/ApiAuth";
import "./dashboard.css";

const CURRENCY = "SAR";
const SERIES_1 = "#2a78d6";
const SERIES_2 = "#eb6834";
const STATUS = { good: "#0ca30c", warning: "#fab219", critical: "#d03b3b" };

const fmtNum = (n) => Number(n || 0).toLocaleString("en-US");
const fmtMoney = (n) =>
  Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtCompact = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const fmtMonth = (m) =>
  new Date(`${m}-01T00:00:00`).toLocaleDateString("en-GB", {
    month: "short",
    year: "2-digit",
  });

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const userName = () => {
  try {
    return JSON.parse(localStorage.getItem("authUser"))?.first_name || "";
  } catch (e) {
    return "";
  }
};

const baseChart = {
  toolbar: { show: false },
  fontFamily: "inherit",
  zoom: { enabled: false },
  animations: { enabled: false },
};
const axisLabelStyle = { colors: "#7b8291", fontSize: "11px" };
const grid = { borderColor: "#eceef2", strokeDashArray: 3 };

const Kpi = ({ to, icon, label, value, prefix, sub, tone }) => (
  <Link to={to} className={`adn-kpi ${tone ? `adn-kpi--${tone}` : ""}`}>
    <div className="adn-kpi__top">
      <span>{label}</span>
      <span className="adn-kpi__icon" aria-hidden="true">
        {icon}
      </span>
    </div>
    <div className="adn-kpi__value">
      {prefix && <small>{prefix}</small>}
      {value}
    </div>
    {sub && <div className="adn-kpi__sub">{sub}</div>}
  </Link>
);

const Panel = ({ title, aside, flush, children }) => (
  <section className="adn-panel" aria-label={title}>
    <div className="adn-panel__head">
      <h2>{title}</h2>
      {aside}
    </div>
    <div className={`adn-panel__body ${flush ? "adn-panel__body--flush" : ""}`}>
      {children}
    </div>
  </section>
);

const Empty = ({ children }) => <div className="adn-empty">{children}</div>;

const TrendPanel = ({ monthly }) => {
  const [tab, setTab] = useState("money");
  const categories = monthly.map((m) => fmtMonth(m.month));
  const isMoney = tab === "money";
  const series = isMoney
    ? [
        { name: "Sales", data: monthly.map((m) => m.sales) },
        { name: "Purchase", data: monthly.map((m) => m.purchase) },
      ]
    : [
        { name: "Jobs", data: monthly.map((m) => m.jobs) },
        { name: "Enquiries", data: monthly.map((m) => m.enquiries) },
      ];
  const options = {
    chart: { ...baseChart, type: isMoney ? "bar" : "line" },
    colors: [SERIES_1, SERIES_2],
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    stroke: isMoney
      ? { show: true, width: 2, colors: ["transparent"] }
      : { width: 2, curve: "straight" },
    markers: { size: isMoney ? 0 : 4, strokeWidth: 2, strokeColors: "#fff" },
    dataLabels: { enabled: false },
    grid,
    legend: { position: "top", horizontalAlign: "left", fontSize: "12px" },
    xaxis: {
      categories,
      labels: { style: axisLabelStyle },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: axisLabelStyle,
        formatter: (v) => (isMoney ? fmtCompact(v) : fmtNum(Math.round(v))),
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (v) => (isMoney ? `${CURRENCY} ${fmtMoney(v)}` : fmtNum(v)),
      },
    },
  };

  return (
    <Panel
      title="Monthly trend"
      aside={
        <div className="adn-tabs" role="tablist" aria-label="Trend measure">
          <button
            role="tab"
            aria-selected={isMoney}
            onClick={() => setTab("money")}
          >
            Invoiced ({CURRENCY}, incl. VAT)
          </button>
          <button
            role="tab"
            aria-selected={!isMoney}
            onClick={() => setTab("volume")}
          >
            Jobs & enquiries
          </button>
        </div>
      }
    >
      <ReactApexChart
        key={tab}
        type={isMoney ? "bar" : "line"}
        series={series}
        options={options}
        height={300}
      />
      <table className="sr-only-table">
        <caption>Monthly trend data</caption>
        <thead>
          <tr>
            <th>Month</th>
            {series.map((s) => (
              <th key={s.name}>{s.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthly.map((m, i) => (
            <tr key={m.month}>
              <td>{categories[i]}</td>
              {series.map((s) => (
                <td key={s.name}>{s.data[i]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
};

const HorizontalBars = ({ title, rows, labelKey, linkTo, aside }) => {
  const options = {
    chart: { ...baseChart, type: "bar" },
    colors: [SERIES_1],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      offsetX: 6,
      style: { colors: ["#545b69"], fontSize: "11px", fontWeight: 600 },
    },
    grid: { ...grid, xaxis: { lines: { show: false } } },
    xaxis: {
      categories: rows.map((r) => r[labelKey]),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { ...axisLabelStyle, fontSize: "12px" }, maxWidth: 160 } },
    tooltip: { y: { formatter: (v) => `${fmtNum(v)} jobs` } },
  };
  return (
    <Panel
      title={title}
      aside={aside || (linkTo && <Link to={linkTo}>View all</Link>)}
    >
      {rows.length ? (
        <ReactApexChart
          type="bar"
          series={[{ name: "Jobs", data: rows.map((r) => r.count) }]}
          options={options}
          height={Math.max(160, rows.length * 32 + 30)}
        />
      ) : (
        <Empty>No data yet</Empty>
      )}
    </Panel>
  );
};

const PaymentStatus = ({ inv }) => {
  const total = inv.paid_count + inv.partial_count + inv.unpaid_count || 1;
  const parts = [
    { label: "Paid", count: inv.paid_count, color: STATUS.good },
    { label: "Partially paid", count: inv.partial_count, color: STATUS.warning },
    { label: "Unpaid", count: inv.unpaid_count, color: STATUS.critical },
  ];
  return (
    <Panel title="Invoice collection" aside={<Link to="/invoices">Invoices</Link>}>
      <div
        className="adn-split"
        role="img"
        aria-label={parts.map((p) => `${p.label} ${p.count}`).join(", ")}
      >
        {parts
          .filter((p) => p.count)
          .map((p) => (
            <div
              key={p.label}
              style={{ width: `${(p.count / total) * 100}%`, background: p.color }}
              title={`${p.label}: ${fmtNum(p.count)}`}
            />
          ))}
      </div>
      <ul className="adn-legend">
        {parts.map((p) => (
          <li key={p.label}>
            <span>
              <span className="adn-dot" style={{ background: p.color }} />
              {p.label}
            </span>
            <b>
              {fmtNum(p.count)}{" "}
              <span style={{ color: "var(--dash-text-3)", fontWeight: 400 }}>
                ({p.count && p.count / total < 0.01 ? "<1" : Math.round((p.count / total) * 100)}%)
              </span>
            </b>
          </li>
        ))}
      </ul>
      <hr style={{ borderColor: "var(--dash-border)", opacity: 1 }} />
      <ul className="adn-legend">
        <li>
          <span>Sales invoiced (incl. VAT)</span>
          <b>
            {CURRENCY} {fmtMoney(inv.sales_amount)}
          </b>
        </li>
        <li>
          <span>Purchases booked (incl. VAT)</span>
          <b>
            {CURRENCY} {fmtMoney(inv.purchase_amount)}
          </b>
        </li>
        <li>
          <span>Sales minus purchases</span>
          <b>
            {CURRENCY} {fmtMoney(inv.sales_amount - inv.purchase_amount)}
          </b>
        </li>
      </ul>
    </Panel>
  );
};

const VoucherSummary = ({ vouchers }) => {
  const types = ["Payment", "Receipt", "Journal", "CreditNote", "DebitNote"];
  const labels = { CreditNote: "Credit note", DebitNote: "Debit note" };
  return (
    <Panel
      title="Vouchers"
      aside={<Link to="/vouchers">{fmtNum(vouchers.total)} total</Link>}
    >
      <ul className="adn-legend">
        {types.map((t) => (
          <li key={t}>
            <span>{labels[t] || t}</span>
            <b>{fmtNum(vouchers.by_type?.[t] || 0)}</b>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

const LoadingState = () => (
  <>
    <div className="adn-kpis">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="adn-skeleton" style={{ height: 112 }} />
      ))}
    </div>
    <Row>
      <Col xl={8}>
        <div className="adn-skeleton" style={{ height: 360, marginBottom: 20 }} />
      </Col>
      <Col xl={4}>
        <div className="adn-skeleton" style={{ height: 360, marginBottom: 20 }} />
      </Col>
    </Row>
  </>
);

const DashboardCrm = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  document.title = "Dashboard | ADNOV";

  const load = () => {
    setLoading(true);
    setError(false);
    apiAuth
      .get("/api/dashboard-summary/")
      .then((response) => setData(response.data))
      .catch((err) => {
        console.log(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const name = userName();
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const activeStages = (data?.pipeline || []).filter(
    (p) => p.count && !["RFQ", "Finished", "Cancelled"].includes(p.status)
  );
  const topClientMax = Math.max(1, ...(data?.top_clients || []).map((c) => c.jobs));

  return (
    <div className="page-content">
      <div className="container-fluid adn-dash">
        <header className="adn-dash__header">
          <div>
            <h1>
              {greeting()}
              {name ? `, ${name}` : ""}
            </h1>
            <p>{today} · Here is what needs your attention today.</p>
          </div>
          <nav className="adn-dash__actions" aria-label="Quick actions">
            <Link to="/jobs/add" className="adn-dash__btn">
              <PlusLg aria-hidden="true" /> New enquiry
            </Link>
            <Link to="/jobs/createjob" className="adn-dash__btn adn-dash__btn--primary">
              <PlusLg aria-hidden="true" /> New job
            </Link>
            <button
              type="button"
              className="adn-dash__btn"
              onClick={load}
              disabled={loading}
              aria-label="Refresh dashboard"
            >
              <ArrowClockwise aria-hidden="true" /> Refresh
            </button>
          </nav>
        </header>

        {error && !data && (
          <div className="adn-panel" style={{ height: "auto" }}>
            <Empty>
              Couldn't load the dashboard.{" "}
              <button type="button" className="adn-dash__btn" onClick={load}>
                Try again
              </button>
            </Empty>
          </div>
        )}

        {loading && !data && <LoadingState />}

        {data && (
          <>
            <div className="adn-kpis">
              <Kpi
                to="/jobs"
                icon={<Truck size={16} />}
                label="Jobs in progress"
                value={fmtNum(data.jobs.in_progress)}
                sub={`${fmtNum(data.jobs.total)} total · ${fmtNum(data.jobs.finished)} finished`}
              />
              <Kpi
                to="/jobs"
                icon={<ChatSquareText size={16} />}
                label="Open enquiries"
                value={fmtNum(data.enquiries.open)}
                sub={`${fmtNum(data.enquiries.total)} total · ${fmtNum(data.enquiries.converted)} progressed`}
              />
              <Kpi
                to="/invoices"
                icon={<Receipt size={16} />}
                label="Sales invoiced"
                prefix={CURRENCY}
                value={fmtCompact(data.invoices.sales_amount)}
                sub={`${fmtNum(data.invoices.sales_count)} sales invoices · incl. VAT`}
              />
              <Kpi
                to="/invoices"
                icon={<CashStack size={16} />}
                label="Receivables"
                prefix={CURRENCY}
                value={fmtCompact(data.invoices.receivable)}
                sub={`${fmtNum(data.invoices.receivable_count)} invoices to collect`}
              />
              <Kpi
                to="/invoices"
                tone={data.invoices.overdue_count ? "critical" : undefined}
                icon={<ExclamationTriangleFill size={16} />}
                label="Overdue"
                prefix={CURRENCY}
                value={fmtCompact(data.invoices.overdue)}
                sub={
                  data.invoices.overdue_count
                    ? `${fmtNum(data.invoices.overdue_count)} invoices past due date`
                    : "Nothing overdue"
                }
              />
              <Kpi
                to="/purchase"
                icon={<Wallet2 size={16} />}
                label="Payables"
                prefix={CURRENCY}
                value={fmtCompact(data.invoices.payable)}
                sub={`${fmtNum(data.invoices.payable_count)} purchase invoices open`}
              />
            </div>

            <Row>
              <Col xl={8}>
                <TrendPanel monthly={data.monthly} />
              </Col>
              <Col xl={4}>
                <HorizontalBars
                  title="Where active jobs are"
                  rows={activeStages}
                  labelKey="status"
                  linkTo="/jobs"
                />
              </Col>
            </Row>

            <Row>
              <Col xl={8}>
                <Panel
                  title="Latest active shipments"
                  flush
                  aside={
                    <Link to="/jobs">
                      All jobs <ArrowRight aria-hidden="true" />
                    </Link>
                  }
                >
                  {data.active_shipments.length ? (
                    <div className="adn-table-wrap">
                      <table className="adn-table">
                        <thead>
                          <tr>
                            <th>Job</th>
                            <th>Client</th>
                            <th>Mode</th>
                            <th>Route</th>
                            <th>Status</th>
                            <th>ETA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.active_shipments.map((j) => (
                            <tr key={j.id}>
                              <td>
                                <Link to={`/job/${j.id}`}>{j.job_number || `#${j.id}`}</Link>
                              </td>
                              <td className="strong route">{j.client || "—"}</td>
                              <td>{j.type || "—"}</td>
                              <td className="route" title={`${j.pol || "—"} → ${j.pod || "—"}`}>
                                {j.pol || "—"} → {j.pod || "—"}
                              </td>
                              <td>
                                <span className="adn-badge">{j.status}</span>
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>{fmtDate(j.eta)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty>No jobs in progress</Empty>
                  )}
                </Panel>
              </Col>
              <Col xl={4}>
                <PaymentStatus inv={data.invoices} />
              </Col>
            </Row>

            <Row>
              <Col xl={6}>
                <Panel
                  title="Overdue invoices to chase"
                  flush
                  aside={<span>Largest balances first</span>}
                >
                  {data.overdue_invoices.length ? (
                    <div className="adn-table-wrap">
                      <table className="adn-table">
                        <thead>
                          <tr>
                            <th>Invoice</th>
                            <th>Client</th>
                            <th className="num">Balance ({CURRENCY})</th>
                            <th>Overdue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.overdue_invoices.map((i) => (
                            <tr key={i.id}>
                              <td>
                                <Link to={`/job/${i.job_id}`} title={`Job ${i.job_number || ""}`}>
                                  {i.invoice_number}
                                </Link>
                              </td>
                              <td className="strong route">{i.client || "—"}</td>
                              <td className="num strong">{fmtMoney(i.balance)}</td>
                              <td>
                                <span className="adn-overdue">
                                  <ExclamationTriangleFill size={12} aria-hidden="true" />
                                  {fmtNum(i.days_overdue)} days
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty>No overdue invoices. Nice work.</Empty>
                  )}
                </Panel>
              </Col>
              <Col xl={3} md={6}>
                <Panel title="New enquiries" aside={<Link to="/jobs">View all</Link>}>
                  {data.recent_enquiries.length ? (
                    <ul className="adn-list">
                      {data.recent_enquiries.map((e) => (
                        <li key={e.id}>
                          <div className="adn-list__row">
                            <span>
                              <Link to={`/job/${e.id}`}>{e.enquiry_number || `#${e.id}`}</Link>{" "}
                              {e.client || ""}
                            </span>
                          </div>
                          <div className="adn-list__meta">
                            {e.type || "—"} · {fmtDate(e.created_at)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>No open enquiries</Empty>
                  )}
                </Panel>
              </Col>
              <Col xl={3} md={6}>
                <Panel title="Top clients by jobs">
                  {data.top_clients.length ? (
                    <ul className="adn-list">
                      {data.top_clients.map((c) => (
                        <li key={c.name}>
                          <div className="adn-list__row">
                            <span title={c.name}>{c.name}</span>
                            <b>{fmtNum(c.jobs)}</b>
                          </div>
                          <div className="adn-meter" aria-hidden="true">
                            <div style={{ width: `${(c.jobs / topClientMax) * 100}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Empty>No clients yet</Empty>
                  )}
                </Panel>
              </Col>
            </Row>

            <Row>
              <Col xl={8}>
                <HorizontalBars
                  title="Jobs by freight mode"
                  rows={data.freight}
                  labelKey="type"
                  aside={
                    <span>
                      <Briefcase aria-hidden="true" /> {fmtNum(data.jobs.total)} jobs
                    </span>
                  }
                />
              </Col>
              <Col xl={4}>
                <VoucherSummary vouchers={data.vouchers} />
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardCrm;
