import React from "react";
import { MailCheck, ArrowRight, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// SignupConfirmed component (seguindo padrão shadcn-ui)
export default function SignupConfirmed({
  email = "",
  onResend = () => {},
  onGoToLogin = () => { window.location.href = '/login' },
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-xl">
        <CardContent className="p-8 md:p-12">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/30">
              <MailCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                Cadastro confirmado!
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Quase lá — só falta ativar sua conta
              </p>
            </div>
          </div>

          <div className="mt-8 border rounded-lg border-border bg-muted/40 p-6">
            <p className="text-foreground leading-relaxed">
              Verifique o seu email{" "}
              {email ? (
                <span className="font-medium text-primary">({email})</span>
              ) : (
                ""
              )}{" "}
              e clique no link de confirmação para ativar a sua conta.
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              Não recebeu o email? Verifique a pasta de spam ou solicite o
              reenvio abaixo.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <Button
                onClick={onResend}
                variant="outline"
                className="gap-2"
                aria-label="Reenviar email de confirmação"
              >
                <Repeat className="w-4 h-4" />
                Reenviar email
              </Button>

              <Button
                onClick={onGoToLogin}
                className="mt-3 sm:mt-0 gap-2"
                aria-label="Ir para login"
              >
                Ir para login
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <p>
              Dica: o link de confirmação expira por motivos de segurança. Caso
              o link esteja expirado, clique em
              <span className="text-primary font-medium">
                {" "}
                "Reenviar email"
              </span>{" "}
              para receber um novo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
