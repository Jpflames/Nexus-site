import { AuthForm } from "@/components/auth/auth-form";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata = {
  title: "Sign Up | Nexus Media Access",
  description: "Create your Nexus Media account to start secure checkout and access the student dashboard.",
};

export default function SignupPage() {
  return (
    <main className="nexus-page-glow pb-24 pt-20">
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="glass-card rounded-[2rem] border border-white/10 bg-black/70 p-10 shadow-[0_40px_120px_rgba(16,185,129,0.14)]">
            <AuthForm mode="sign-up" />
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
