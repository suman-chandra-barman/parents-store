import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PreRegistrationFormComponent } from "@/features/pre-registration/components/PreRegistrationForm";

interface PageProps {
  params: Promise<{ password: string }>;
}

export default async function PreRegistrationPage({ params }: PageProps) {
  const { password } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="size-8 text-brand animate-spin" />
        </div>
      }
    >
      <PreRegistrationFormComponent
        key={password}
        urlPassword={password}
      />
    </Suspense>
  );
}
