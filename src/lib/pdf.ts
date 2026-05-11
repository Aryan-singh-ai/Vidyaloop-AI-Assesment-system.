import { ScoreResult } from "./scoring";
import { AIReportData } from "./ai";

export async function generatePDFReport(
  userName: string,
  dimensionScores: ScoreResult[],
  aiReport: any
): Promise<Buffer> {
  let browser;
  
  if (process.env.VERCEL) {
    const chromium = require("@sparticuz/chromium");
    const puppeteer = require("puppeteer-core");
    
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    const puppeteer = require("puppeteer");
    browser = await puppeteer.launch({
      headless: true,
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  const page = await browser.newPage();

  const dimensionPages = [
    { key: "STRESS_HANDLING", title: "Stress Handling" },
    { key: "EMOTIONAL_REGULATION", title: "Emotional Regulation" },
    { key: "RESILIENCE_RECOVERY", title: "Resilience & Recovery" },
    { key: "EMOTIONAL_AWARENESS", title: "Emotional Awareness" },
    { key: "SOCIAL_EMOTIONAL_COMFORT", title: "Social & Emotional Comfort" },
  ];

  // Create a beautiful multi-page HTML template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; margin: 0; color: #1e293b; line-height: 1.6; }
          .page { height: 297mm; width: 210mm; padding: 30mm; box-sizing: border-box; page-break-after: always; position: relative; }
          .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .logo { color: #6366f1; font-size: 24px; font-weight: bold; }
          .title { font-size: 32px; font-weight: 800; margin-bottom: 10px; color: #0f172a; }
          .dimension-title { font-size: 28px; font-weight: 800; color: #4338ca; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
          .divider { height: 2px; background: #e2e8f0; margin-bottom: 30px; }
          .section-label { font-size: 14px; font-weight: 900; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; margin-top: 35px; }
          .content-text { font-size: 16px; color: #334155; text-align: justify; }
          .list-item { margin-bottom: 12px; display: flex; align-items: start; font-size: 15px; }
          .bullet { color: #6366f1; margin-right: 15px; font-weight: bold; font-size: 20px; line-height: 1; }
          .advice-box { background: #f8fafc; border-radius: 16px; padding: 25px; border-left: 6px solid #6366f1; margin-top: 20px; }
          .action-card { background: #f1f5f9; border-radius: 12px; padding: 15px; margin-bottom: 10px; display: flex; align-items: center; gap: 15px; }
          .action-num { background: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; }
          .footer { position: absolute; bottom: 30mm; left: 30mm; right: 30mm; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
          .snapshot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .overall-score { font-size: 72px; font-weight: 900; color: #6366f1; margin: 20px 0; }
          @media print { .page { page-break-after: always; } }
        </style>
      </head>
      <body>
        ${dimensionPages.map((dim) => {
          const analysis = aiReport.dimensions?.[dim.key] || {
            summary: "Analysis pending...",
            strengths: [],
            challenges: [],
            improvementAdvice: "Keep growing.",
            actionSteps: []
          };
          const score = dimensionScores.find(s => s.dimension === dim.key);

          return `
            <div class="page">
              <div class="header">
                <div class="logo">Vidyaloop AI</div>
                <div style="font-size: 14px; font-weight: 600; color: #64748b;">${dim.title} • Page Analysis</div>
              </div>
              
              <div class="dimension-title">${dim.title}</div>
              <div style="font-size: 18px; font-weight: 600; color: #64748b; margin-bottom: 30px;">
                Current Score: ${score?.score}/${score?.maxScore} (${score?.classification})
              </div>
              <div class="divider"></div>

              <div class="section-label">Summary</div>
              <p class="content-text">${analysis.summary}</p>

              <div class="section-label">Strengths</div>
              ${analysis.strengths.map((s: string) => `
                <div class="list-item"><span class="bullet">•</span> <span>${s}</span></div>
              `).join("")}

              <div class="section-label">Challenges</div>
              ${analysis.challenges.map((c: string) => `
                <div class="list-item"><span class="bullet">○</span> <span>${c}</span></div>
              `).join("")}

              <div class="section-label">Improvement Advice</div>
              <div class="advice-box">
                <p style="margin:0; font-size: 15px; font-weight: 500;">${analysis.improvementAdvice}</p>
              </div>

              <div class="section-label">Action Steps</div>
              <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                ${analysis.actionSteps.map((step: string, i: number) => `
                  <div class="action-card">
                    <div class="action-num">${i + 1}</div>
                    <div style="font-weight: 600; font-size: 14px;">${step}</div>
                  </div>
                `).join("")}
              </div>

              <div class="footer">
                Vidyaloop Emotional Balance Assessment • Prepared for ${userName}
              </div>
            </div>
          `;
        }).join("")}

        <!-- FINAL PAGE: SNAPSHOT -->
        <div class="page">
          <div class="header">
            <div class="logo">Vidyaloop AI</div>
            <div style="font-size: 14px; font-weight: 600; color: #64748b;">Final Snapshot</div>
          </div>

          <div class="title">Overall Emotional Balance</div>
          <p style="color: #64748b; font-size: 18px; margin-bottom: 40px;">Consolidated assessment results and final recommendations.</p>
          
          <div class="snapshot-grid">
            <div>
              <div class="section-label">Your Balance Score</div>
              <div class="overall-score">${aiReport.overallScore || dimensionScores.reduce((acc, curr) => acc + curr.percentage, 0) / dimensionScores.length}%</div>
              <p class="content-text" style="font-weight: 500; color: #475569;">${aiReport.summary}</p>
            </div>
            <div>
              <div class="section-label">Strongest Areas</div>
              ${aiReport.strengths.map((s: string) => `
                <div class="list-item" style="margin-bottom: 15px;"><span class="bullet" style="color: #10b981;">✓</span> <span style="font-weight: 600;">${s}</span></div>
              `).join("")}

              <div class="section-label" style="margin-top: 30px;">Growth Areas</div>
              ${aiReport.challenges.map((c: string) => `
                <div class="list-item" style="margin-bottom: 15px;"><span class="bullet" style="color: #f59e0b;">→</span> <span style="font-weight: 600;">${c}</span></div>
              `).join("")}
            </div>
          </div>

          <div class="section-label" style="margin-top: 50px;">Recommended Focus Areas</div>
          <p class="content-text">${aiReport.improvementAdvice}</p>

          <div class="section-label">Global Action Steps</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            ${aiReport.actionSteps.map((step: string, i: number) => `
              <div class="action-card" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                <div class="action-num" style="background: #0f172a;">${i + 1}</div>
                <div style="font-weight: 600; font-size: 13px;">${step}</div>
              </div>
            `).join("")}
          </div>

          <div class="advice-box" style="margin-top: 50px; background: #6366f1; border: none; color: white;">
            <h4 style="margin: 0 0 10px 0; font-size: 18px;">A Note from Vidyaloop AI</h4>
            <p style="margin:0; opacity: 0.9; font-size: 15px;">Remember, emotional intelligence is a journey, not a destination. These results are a starting point for self-discovery and growth. Keep reflecting, keep learning, and keep growing.</p>
          </div>

          <div class="footer">
            Vidyaloop Emotional Balance Assessment • Prepared for ${userName}
          </div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" } // Managed via CSS padding
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
}
