import { AuthForm } from "@/components/auth/auth-form";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata = {
  title: "Login | Nexus Media Member Access",
  description: "Sign in to your Nexus Media account to access checkout, profile, and the student dashboard.",
};

export default function LoginPage() {
  return (
    <main className="nexus-page-glow pb-24 pt-20">
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="glass-card rounded-[2rem] border border-white/10 bg-black/70 p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
            <AuthForm mode="sign-in" />
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
