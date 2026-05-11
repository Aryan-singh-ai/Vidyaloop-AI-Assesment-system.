import path from "path";
import { ScoreResult } from "./scoring";

// Color palette
const INDIGO = "#6366f1";
const DARK = "#0f172a";
const SLATE = "#334155";
const MUTED = "#94a3b8";
const LIGHT_BG = "#f8fafc";
const EMERALD = "#10b981";
const AMBER = "#f59e0b";
const WHITE = "#ffffff";

function drawPageHeader(doc: any, title: string, subtitle: string) {
  doc.rect(0, 0, doc.page.width, 80).fill(WHITE);
  doc
    .moveTo(40, 78)
    .lineTo(doc.page.width - 40, 78)
    .lineWidth(2)
    .strokeColor(INDIGO)
    .stroke();

  doc.fillColor(INDIGO).fontSize(18).font("Helvetica-Bold").text("Vidyaloop AI", 40, 24);
  doc
    .fillColor(MUTED)
    .fontSize(11)
    .font("Helvetica")
    .text(subtitle, 0, 32, { align: "right", width: doc.page.width - 40 });

  doc.fillColor(DARK).fontSize(26).font("Helvetica-Bold").text(title, 40, 100);
  doc
    .moveTo(40, 132)
    .lineTo(doc.page.width - 40, 132)
    .lineWidth(1)
    .strokeColor("#e2e8f0")
    .stroke();
}

function drawSectionLabel(doc: any, label: string, yOverride?: number) {
  const yPos = yOverride ?? doc.y + 18;
  doc
    .fillColor(INDIGO)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(label.toUpperCase(), 40, yPos, { characterSpacing: 1.5 });
  doc.moveDown(0.3);
}

function drawBulletList(doc: any, items: string[], bullet = "•", color = INDIGO) {
  items.forEach((item: string) => {
    const startY = doc.y;
    doc.fillColor(color).fontSize(14).font("Helvetica-Bold").text(bullet, 40, startY, { width: 20 });
    doc
      .fillColor(SLATE)
      .fontSize(12)
      .font("Helvetica")
      .text(item, 65, startY, { width: doc.page.width - 105 });
    doc.moveDown(0.4);
  });
}

function drawAdviceBox(doc: any, text: string) {
  const boxY = doc.y + 10;
  const textWidth = doc.page.width - 120;
  const textHeight = doc.heightOfString(text, { width: textWidth });
  const boxHeight = textHeight + 30;

  doc.rect(40, boxY, doc.page.width - 80, boxHeight).fillAndStroke(LIGHT_BG, "#e2e8f0");
  doc.rect(40, boxY, 5, boxHeight).fill(INDIGO);
  doc
    .fillColor(SLATE)
    .fontSize(12)
    .font("Helvetica-Oblique")
    .text(text, 65, boxY + 15, { width: textWidth });
  doc.y = boxY + boxHeight + 15;
}

function drawActionSteps(doc: any, steps: string[]) {
  steps.forEach((step: string, i: number) => {
    const stepY = doc.y;
    doc.circle(55, stepY + 10, 12).fill(INDIGO);
    doc.fillColor(WHITE).fontSize(10).font("Helvetica-Bold").text(`${i + 1}`, 49, stepY + 5);
    const textWidth = doc.page.width - 120;
    const textH = doc.heightOfString(step, { width: textWidth }) + 16;
    doc.rect(78, stepY, textWidth + 10, textH).fill("#f1f5f9");
    doc.fillColor(DARK).fontSize(12).font("Helvetica-Bold").text(step, 88, stepY + 8, { width: textWidth });
    doc.y = stepY + textH + 8;
  });
}

function drawFooter(doc: any, userName: string) {
  const footerY = doc.page.height - 50;
  doc
    .moveTo(40, footerY - 10)
    .lineTo(doc.page.width - 40, footerY - 10)
    .lineWidth(0.5)
    .strokeColor("#e2e8f0")
    .stroke();
  doc
    .fillColor(MUTED)
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Vidyaloop Emotional Balance Assessment  •  Prepared for ${userName}`,
      40,
      footerY,
      { align: "center", width: doc.page.width - 80 }
    );
}

const DIMENSION_PAGES = [
  { key: "STRESS_HANDLING", title: "Stress Handling" },
  { key: "EMOTIONAL_REGULATION", title: "Emotional Regulation" },
  { key: "RESILIENCE_RECOVERY", title: "Resilience & Recovery" },
  { key: "EMOTIONAL_AWARENESS", title: "Emotional Awareness" },
  { key: "SOCIAL_EMOTIONAL_COMFORT", title: "Social & Emotional Comfort" },
];

export async function generatePDFReport(
  userName: string,
  dimensionScores: ScoreResult[],
  aiReport: any
): Promise<Buffer> {
  // Move dynamic requires inside the function to avoid build-time evaluation issues with Turbopack
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PDFDocument = require("pdfkit");
  const pdfkitRoot = path.dirname(require.resolve("pdfkit/package.json"));

  return new Promise((resolve, reject) => {
    try {
      // Ensure PDFKit can find its own AFM font data regardless of Next.js cwd
      process.env.PDFKIT_FONT_PATH = path.join(pdfkitRoot, "js", "data");

      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        bufferPages: true,
        autoFirstPage: true,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const overallScore =
        aiReport.overallScore ??
        dimensionScores.reduce((a, c) => a + c.percentage, 0) / dimensionScores.length;

      // ─── COVER PAGE ──────────────────────────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 300).fill(INDIGO);

      doc.fillColor(WHITE).fontSize(36).font("Helvetica-Bold").text("Vidyaloop AI", 60, 80);
      doc
        .fillColor("#ffffffb3")
        .fontSize(16)
        .font("Helvetica")
        .text("Emotional Balance Assessment Report", 60, 128);
      doc
        .fillColor(WHITE)
        .fontSize(22)
        .font("Helvetica-Bold")
        .text(`Prepared for: ${userName}`, 60, 180);
      doc
        .fillColor("#ffffffb3")
        .fontSize(14)
        .font("Helvetica")
        .text(
          `Generated: ${new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          60,
          216
        );

      // Score badge
      doc.rect(60, 260, 200, 60).fill("#ffffff26");
      doc
        .fillColor(WHITE)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("OVERALL BALANCE SCORE", 72, 272, { characterSpacing: 0.8 });
      doc
        .fillColor(WHITE)
        .fontSize(28)
        .font("Helvetica-Bold")
        .text(`${Math.round(overallScore)}%`, 72, 290);

      // Summary section on cover
      doc.y = 340;
      doc
        .fillColor(DARK)
        .fontSize(14)
        .font("Helvetica")
        .text(aiReport.summary || "", 60, doc.y, { width: doc.page.width - 120, lineGap: 4 });

      drawFooter(doc, userName);

      // ─── DIMENSION PAGES ─────────────────────────────────────────────────────
      DIMENSION_PAGES.forEach(({ key, title }) => {
        doc.addPage();

        const analysis = aiReport.dimensions?.[key] ?? {
          summary: "Analysis pending for this dimension.",
          strengths: [],
          challenges: [],
          improvementAdvice: "Keep reflecting on your emotional patterns.",
          actionSteps: [],
        };

        const score = dimensionScores.find((s: any) => s.dimension === key);
        const pct = score ? Math.round((score.score / score.maxScore) * 100) : 0;

        drawPageHeader(doc, title, `${title} • Dimension Analysis`);

        doc
          .fillColor(MUTED)
          .fontSize(13)
          .font("Helvetica")
          .text(
            `Score: ${score?.score ?? 0} / ${score?.maxScore ?? 40}  •  ${score?.classification ?? "N/A"}  •  ${pct}%`,
            40,
            148
          );

        // Progress bar
        const barY = 170;
        doc.rect(40, barY, doc.page.width - 80, 8).fill("#e2e8f0");
        doc.rect(40, barY, (doc.page.width - 80) * (pct / 100), 8).fill(INDIGO);
        doc.y = barY + 24;

        drawSectionLabel(doc, "Summary");
        doc
          .fillColor(SLATE)
          .fontSize(12)
          .font("Helvetica")
          .text(analysis.summary, 40, doc.y, { width: doc.page.width - 80, lineGap: 3 });
        doc.moveDown(0.8);

        if (analysis.strengths?.length > 0) {
          drawSectionLabel(doc, "Key Strengths");
          drawBulletList(doc, analysis.strengths, "•", EMERALD);
          doc.moveDown(0.4);
        }

        if (analysis.challenges?.length > 0) {
          drawSectionLabel(doc, "Growth Areas");
          drawBulletList(doc, analysis.challenges, "○", AMBER);
          doc.moveDown(0.4);
        }

        if (analysis.improvementAdvice) {
          drawSectionLabel(doc, "Improvement Advice");
          drawAdviceBox(doc, analysis.improvementAdvice);
        }

        if (analysis.actionSteps?.length > 0) {
          drawSectionLabel(doc, "Action Steps");
          drawActionSteps(doc, analysis.actionSteps);
        }

        drawFooter(doc, userName);
      });

      // ─── FINAL SNAPSHOT PAGE ─────────────────────────────────────────────────
      doc.addPage();
      drawPageHeader(doc, "Overall Emotional Snapshot", "Final Summary");

      doc
        .fillColor(MUTED)
        .fontSize(12)
        .font("Helvetica")
        .text("YOUR BALANCE SCORE", 40, 148, { characterSpacing: 1 });
      doc
        .fillColor(INDIGO)
        .fontSize(64)
        .font("Helvetica-Bold")
        .text(`${Math.round(overallScore)}%`, 40, 164);
      doc.y = 244;

      doc
        .fillColor(SLATE)
        .fontSize(13)
        .font("Helvetica-Oblique")
        .text(`"${aiReport.summary || ""}"`, 40, doc.y, {
          width: doc.page.width - 80,
          lineGap: 4,
        });
      doc.moveDown(1);

      if (aiReport.strengths?.length > 0) {
        drawSectionLabel(doc, "Strongest Areas");
        drawBulletList(doc, aiReport.strengths, "✓", EMERALD);
        doc.moveDown(0.4);
      }

      if (aiReport.challenges?.length > 0) {
        drawSectionLabel(doc, "Growth Areas");
        drawBulletList(doc, aiReport.challenges, "→", AMBER);
        doc.moveDown(0.4);
      }

      if (aiReport.improvementAdvice) {
        drawSectionLabel(doc, "Recommended Focus Areas");
        drawAdviceBox(doc, aiReport.improvementAdvice);
      }

      if (aiReport.actionSteps?.length > 0) {
        drawSectionLabel(doc, "Global Action Steps");
        drawActionSteps(doc, aiReport.actionSteps);
      }

      // Closing note box
      const noteY = doc.y + 16;
      doc.rect(40, noteY, doc.page.width - 80, 75).fill(INDIGO);
      doc
        .fillColor(WHITE)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("A Note from Vidyaloop AI", 60, noteY + 12);
      doc
        .fillColor("#ffffffd9")
        .fontSize(11)
        .font("Helvetica")
        .text(
          "Remember, emotional intelligence is a journey, not a destination. These results are a starting point for self-discovery and growth. Keep reflecting, keep learning, and keep growing.",
          60,
          noteY + 34,
          { width: doc.page.width - 120 }
        );

      drawFooter(doc, userName);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
