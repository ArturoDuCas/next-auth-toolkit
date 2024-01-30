"use client";

import * as z from "zod";
import {useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSearchParams} from "next/navigation";

import {NewPasswordSchema} from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import FormError from "@/components/formError";
import FormSuccess from "@/components/formSuccess";
import {newPassword} from "@/actions/newPassword";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    }
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");


    startTransition(() => {
      newPassword(values, token)
          .then((data) => {
            setError(data?.error);
            setSuccess(data?.success);
          })
    })
  };

  return (
      <Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                            {...field}
                            placeholder="******"
                            type="password"
                            disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                )}
            />
          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button
              type="submit"
              className="w-full"
              disabled={isPending}
          >
            Reset password
          </Button>

        </form>
      </Form>
  )
}

export default NewPasswordForm;