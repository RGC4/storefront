import type { PropsWithChildren } from "react";
import { FieldValues, FormProvider as ReactHookFormProvider, UseFormReturn } from "react-hook-form";

  methods: UseFormReturn<T>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
  children,
  methods,
  onSubmit
}: Props<T>) {
  return (
    <ReactHookFormProvider {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </ReactHookFormProvider>
  );
}
