"use client";

import React, {useTransition, useState} from 'react';
import {useSession} from "next-auth/react";
import * as z from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardContent,

} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import FormSuccess from "@/components/formSuccess";
import FormError from "@/components/formError";
import {settings} from "@/actions/settings";
import {SettingSchema} from "@/schemas";
import {useCurrentUser} from "@/hooks/useCurrentUser";


const SettingsPage = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const {update} = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      name: user?.name || undefined,
    }
  });


  const onSubmit = async (values: z.infer<typeof SettingSchema>) => {
    startTransition(async () => {
      settings(values)
          .then((data) => {
            if (data.error) setError(data.error);

            if (data.success) {
              update();
              setSuccess(data.success)
            }
          })
          .catch(() => {
            setError("Something went wrong!");
          })
    })
  };

  return (
      <Card className="w-[600px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            🔩 Settings
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4" >
                <FormField
                    name="name"
                    control={form.control}
                    render={({field}) => {
                      return (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                  {...field}
                                  placeholder="John Doe"
                                  disabled={isPending}
                              />
                            </FormControl>
                          </FormItem>
                      )
                    }}
                />
              </div>
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button type="submit" disabled={isPending}>Save</Button>

            </form>
          </Form>
        </CardContent>
      </Card>
  );
};

export default SettingsPage;