"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  bookingFormSchema,
  type BookingFormData,
} from "../schema/booking-form-schema";
import { createBooking, type FormState } from "../actions/booking-action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/app/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/app/ui/form";
import { Input } from "@/src/app/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/app/ui/select";
import { Button } from "@/src/app/ui/button";
import { RadioGroup, RadioGroupItem } from "@/src/app/ui/radio-group";

type BookingModalProps = {
  trigger?: ReactNode;
  eventId: string;
};

const initialFormState: FormState = {
  message: "",
  status: "SUCCESS",
};

export function BookingModal({ trigger, eventId }: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const { data: session } = useSession();
  const userEmail = useMemo(() => session?.user?.email ?? "", [session?.user?.email]);
  const isAuthenticated = userEmail.length > 0;
  const router = useRouter();
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      email: userEmail,
      personName: "",
      organizations: "",
      phone: "",
      city: "",
      state: "",
      donate: 0,
      attending: "no",
    },
  });

  useEffect(() => {
    if (userEmail) {
      form.setValue("email", userEmail);
    }
  }, [form, userEmail]);

  function onSubmit(values: BookingFormData) {
    startTransition(async () => {
      form.clearErrors();
      setFormState(initialFormState);
      if (!isAuthenticated) {
        setFormState({
          message: "Please log in to register for this event.",
          status: "ERROR",
        });
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const result = await createBooking(formState, formData, eventId);
      if (result.status === "SUCCESS") {
        form.reset();
        setOpen(false);
        setFormState(initialFormState);

        if (values.attending === "no") {
          toast.warning("If youre not interested then why submitting form");
        } else {
          toast.success("You are registered for the event!");
        }

        router.refresh();
        return;
      }

      if (result.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            form.setError(field as keyof BookingFormData, {
              type: "server",
              message: messages[0],
            });
          }
        });
      }

      setFormState(result);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline">Create Booking</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-transparent">
        <DialogHeader>
          <DialogTitle>Create a New Booking</DialogTitle>
          <DialogDescription>
            Fill in the details below to book your spot. All fields are
            required.
          </DialogDescription>
        </DialogHeader>
        {formState.message && (
          <div
            className={
              formState.status === "SUCCESS"
                ? "rounded-md bg-emerald-50 text-emerald-700 px-4 py-2"
                : "rounded-md bg-rose-50 text-rose-700 px-4 py-2"
            }
          >
            {formState.message}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="personName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Person Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        value={userEmail}
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organizations</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="ai">
                          Artificial Intelligence
                        </SelectItem>
                        <SelectItem value="ml">Machine Learning </SelectItem>
                        <SelectItem value="devops">DevOps</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="data-analytics">
                          Data Analytics
                        </SelectItem>
                        <SelectItem value="data-sci">Data Science</SelectItem>
                        <SelectItem value="blockchain">Blockchain</SelectItem>
                        <SelectItem value="cybersecurity">
                          Cybersecurity
                        </SelectItem>
                        <SelectItem value="e-sports">Gaming Hub</SelectItem>
                        <SelectItem value="bio-med">
                          Health informatics
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="donate"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Donate ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>Optional donation amount.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="attending"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 space-y-3">
                    <FormLabel>
                      Are you attending the meeting in person?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="online" />
                          </FormControl>
                          <FormLabel className="font-normal">Online</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="ml-auto text-black"
                disabled={isPending || !isAuthenticated}
              >
                {isPending ? "Submitting..." : isAuthenticated ? "Submit Booking" : "Log in to book"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
