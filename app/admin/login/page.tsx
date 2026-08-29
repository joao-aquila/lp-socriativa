import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <main className="container-lp flex min-h-screen flex-col justify-center">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="headline text-4xl">painel da sô</h1>
        <p className="mt-2 text-paper/70">
          entre para gerenciar os projetos do portfólio.
        </p>
        <LoginForm redirectTo={redirect ?? "/admin"} />
      </div>
    </main>
  );
}
