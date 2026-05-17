"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[global-error]", error);
    }
  }, [error]);

  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F6FA",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Apple SD Gothic Neo', sans-serif",
          color: "#181818",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #E4E7EE",
            padding: "32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px",
              borderRadius: 999,
              background: "#277CFA",
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            PACKLESS
          </div>
          <h1
            style={{
              margin: "16px 0 8px",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.3px",
            }}
          >
            앗, 일시적인 문제가 발생했어요.
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.7,
              color: "#475467",
            }}
          >
            잠시 후 다시 시도해주세요. 문제가 반복되면 hello@packless.app 으로
            알려주세요.
          </p>
          {error.digest ? (
            <p
              style={{
                marginTop: 12,
                fontSize: 11,
                color: "#98A1B0",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              오류 코드 · {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              borderRadius: 10,
              background: "#277CFA",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
