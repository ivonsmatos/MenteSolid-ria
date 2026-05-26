import Link from 'next/link';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { PacientePublicoCadastroInput } from '@/lib/validators';
import { TERMO_LGPD_VERSAO } from '@/lib/lgpd';

type Props = {
  register: UseFormRegister<PacientePublicoCadastroInput>;
  errors: FieldErrors<PacientePublicoCadastroInput>;
};

export function ConsentimentoLGPD({ register, errors }: Props) {
  return (
    <div className="rounded border border-slate-300 bg-slate-50 p-4">
      <label className="flex items-start gap-3 text-sm" htmlFor="consentimento-lgpd">
        <input
          className="mt-1"
          id="consentimento-lgpd"
          type="checkbox"
          {...register('consentimentoLgpd')}
        />
        <span>
          Li e aceito a{' '}
          <Link className="text-blue-700 underline" href="/politica-lgpd" target="_blank">
            política de privacidade e tratamento de dados (LGPD)
          </Link>{' '}
          do MenteSolidária — versão {TERMO_LGPD_VERSAO}. Autorizo o tratamento dos meus
          dados sensíveis de saúde para fins de acolhimento e encaminhamento a profissionais
          voluntários.
        </span>
      </label>
      {errors.consentimentoLgpd ? (
        <p className="mt-2 text-sm text-red-600">
          {errors.consentimentoLgpd.message as string}
        </p>
      ) : null}
    </div>
  );
}
