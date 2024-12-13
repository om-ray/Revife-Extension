"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { userService } from "@/firebase/userService";

declare global {
  interface Window {
    heyflow: any;
  }
}

export default function SurveyPage() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.heyflow.app/widget/latest/webloader.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.heyflow.load({
        flowId: "YOUR_HEYFLOW_ID", // Replace with your Heyflow ID
        container: "heyflow-container",
        onSubmit: async (data: any) => {
          if (user?.id) {
            try {
              // Process survey data to match your customer profile structure
              const processedData = {
                // Map Heyflow data to your profile structure
                // This will depend on your specific Heyflow form fields
                surveyData: data,
                lastSurveyUpdate: new Date().toISOString(),
              };

              await userService.updateSurveyData(user.id, processedData);
              router.push("/dashboard");
            } catch (error) {
              console.error("Error saving survey data:", error);
            }
          }
        },
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div id="heyflow-container" style={{ height: "800px" }}></div>
        </div>
      </div>
    </div>
  );
}
