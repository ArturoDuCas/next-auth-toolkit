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
  FormLabel, FormMessage, FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import FormSuccess from "@/components/formSuccess";
import FormError from "@/components/formError";
import {settings} from "@/actions/settings";
import {SettingSchema} from "@/schemas";
import {useCurrentUser} from "@/hooks/useCurrentUser";
import {UserRole} from "@prisma/client";


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
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    }
  });


  const onSubmit = async (values: z.infer<typeof SettingSchema>) => {
    startTransition(async () => {
      settings(values)
          .then((data) => {
            setSuccess(undefined);
            setError(undefined);

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
              <div className="space-y-4">
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
                            <FormMessage/>
                          </FormItem>
                      )
                    }}
                />

                {user?.isOAuth === false && (
                    <>
                      <FormField
                          name="email"
                          control={form.control}
                          render={({field}) => {
                            return (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="john_doe@example.com"
                                        type="email"
                                        disabled={isPending}
                                    />
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                            )
                          }}
                      />
                      <FormField
                          name="password"
                          control={form.control}
                          render={({field}) => {
                            return (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
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
                            )
                          }}
                      />
                      <FormField
                          name="newPassword"
                          control={form.control}
                          render={({field}) => {
                            return (
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
                            )
                          }}
                      />
                    </>
                )}
                <FormField
                    name="role"
                    control={form.control}
                    render={({field}) => {
                      return (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                                disabled={isPending}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={UserRole.ADMIN}>
                                  Admin
                                </SelectItem>
                                <SelectItem value={UserRole.USER}>
                                  User
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                      )
                    }}
                />
                {user?.isOAuth === false && (
                      <FormField
                          name="isTwoFactorEnabled"
                          control={form.control}
                          render={({field}) => {
                            return (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3 shado-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Two Factor Authentication</FormLabel>
                                    <FormDescription>Enable two factor authentication for your account</FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                        disabled={isPending}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                            )
                          }}
                      />
                )}

              </div>
              <FormSuccess message={success}/>
              <FormError message={error}/>
              <Button type="submit" disabled={isPending}>Save</Button>

            </form>
          </Form>
        </CardContent>
      </Card>
  );
};

export default SettingsPage;