import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { getCampaign } from "@/constants/campaigns";
import { fundedPercent, formatPKRFull } from "@/utils/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const gradientMap: Record<string, string> = {
  "from-emerald-500": "#10b981",
  "from-amber-400": "#f59e0b",
  "from-rose-400": "#fb7185",
  "from-lime-400": "#a3e635",
  "from-sky-400": "#38bdf8",
  "from-violet-500": "#8b5cf6",
  "from-stone-400": "#a8a29e",
  "from-cyan-400": "#22d3ee",
  "from-red-400": "#f87171",
};

function getAccent(gradient: string): string {
  const key = Object.keys(gradientMap).find((k) => gradient.startsWith(k));
  return gradientMap[key ?? "from-emerald-500"];
}

function readImageAsDataUrl(publicPath: string): string | null {
  try {
    const abs = path.join(process.cwd(), "public", publicPath);
    const buf = fs.readFileSync(abs);
    const ext = path.extname(publicPath).slice(1).toLowerCase();
    const mime = ext === "png" ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaign(id);

  if (!campaign) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F5F0E8",
          }}
        >
          <span style={{ fontSize: 48, color: "#2D6A4F", fontWeight: 700 }}>
            Apnaiyat
          </span>
        </div>
      ),
      { ...size },
    );
  }

  const percent = fundedPercent(campaign.raised, campaign.goal);
  const accentColor = getAccent(campaign.gradient);

  // Try to load the real campaign image from /public
  const imageDataUrl = campaign.image
    ? readImageAsDataUrl(campaign.image)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          fontFamily: "sans-serif",
          background: "#F5F0E8",
        }}
      >
        {/* Left: campaign image OR gradient placeholder */}
        <div
          style={{
            width: 460,
            height: "100%",
            flexShrink: 0,
            display: "flex",
            position: "relative",
            overflow: "hidden",
            background: imageDataUrl
              ? "#000"
              : `linear-gradient(160deg, ${accentColor}cc, #1b3a2c)`,
          }}
        >
          {imageDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageDataUrl}
              alt={campaign.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85,
              }}
            />
          )}

          {/* Dark gradient over image for readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.35) 100%)",
              display: "flex",
            }}
          />

          {/* Bottom text on image */}
          <div
            style={{
              position: "absolute",
              bottom: 36,
              left: 32,
              right: 32,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                background: "#2D6A4F",
                borderRadius: 100,
                padding: "5px 16px",
                fontSize: 18,
                color: "#fff",
                fontWeight: 600,
                width: "fit-content",
              }}
            >
              {campaign.type === "ngo" ? "🏢 NGO" : "🙋 Individual"}
            </div>
            <span
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              📍 {campaign.location}
            </span>
          </div>
        </div>

        {/* Right: details */}
        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "44px 52px",
          }}
        >
          {/* Branding */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#2D6A4F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              💚
            </div>
            <span
              style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", display: "flex" }}
            >
              Apnaiyat
            </span>
          </div>

          {/* Title + organizer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "flex",
                background: accentColor + "20",
                border: `2px solid ${accentColor}`,
                borderRadius: 100,
                padding: "4px 16px",
                fontSize: 18,
                color: "#1a1a1a",
                width: "fit-content",
              }}
            >
              {campaign.category}
            </div>

            <div
              style={{
                fontSize: campaign.title.length > 55 ? 32 : 38,
                fontWeight: 800,
                color: "#1a1a1a",
                lineHeight: 1.1,
                letterSpacing: "-0.5px",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {campaign.title}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 100,
                  background: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: "#fff",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {campaign.organizer.charAt(0)}
              </div>
              <span
                style={{
                  fontSize: 20,
                  color: "#444",
                  fontWeight: 600,
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                {campaign.organizer}
                {campaign.verified ? " ✔" : ""}
              </span>
            </div>
          </div>

          {/* Progress + stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Bar */}
            <div
              style={{
                width: "100%",
                height: 14,
                borderRadius: 99,
                background: "#E0D9CC",
                display: "flex",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  borderRadius: 99,
                  background: "linear-gradient(90deg, #2D6A4F, #52B788)",
                  display: "flex",
                }}
              />
            </div>

            {/* Amounts */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: "#1a1a1a",
                    display: "flex",
                  }}
                >
                  {formatPKRFull(campaign.raised)}
                </span>
                <span
                  style={{ fontSize: 17, color: "#6b6b5e", display: "flex" }}
                >
                  of {formatPKRFull(campaign.goal)}
                </span>
              </div>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#2D6A4F",
                  display: "flex",
                }}
              >
                {percent}%
              </span>
            </div>

            {/* Stat pills */}
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { icon: "👥", value: `${campaign.supporters.toLocaleString()} donors` },
                { icon: "⏳", value: `${campaign.daysLeft} days left` },
              ].map(({ icon, value }) => (
                <div
                  key={value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#ECE4D6",
                    borderRadius: 100,
                    padding: "5px 16px",
                    fontSize: 18,
                    color: "#444",
                    fontWeight: 500,
                  }}
                >
                  {icon} {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
