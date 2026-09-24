export function Denied() {
  return (
    <main className="container-lp flex min-h-[70vh] flex-col justify-center">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="headline text-4xl">acesso restrito</h1>
        <p className="mt-3 text-paper/70">
          o painel só abre pelo endereço oficial do site, depois do login por
          e-mail.
        </p>
      </div>
    </main>
  );
}
