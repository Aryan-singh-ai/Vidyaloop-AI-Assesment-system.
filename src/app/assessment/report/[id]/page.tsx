import ReportContent from "./ReportContent";

export const dynamic = "force-dynamic";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  return <ReportContent params={params} />;
}
