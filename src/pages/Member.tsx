import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookiesLogo from "../assets/bookies_logo.png";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useApp } from "../hooks/useApp";
import { TOAST_STYLES } from "../utils/constants";
import { toast } from "sonner";
import MemberDetails from "../components/MemberDetails";

type FormType = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
};

const Member = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const { city, bookiesId } = useParams();
  const { registerMember, getMemberDetails, isGetMemberDetailsLoading } = useApp();

  const fetchMemberDetails = async () => {
    const res = await getMemberDetails(bookiesId, city);
    if (res) {
      setMemberDetails(res);
    }
  };

  useEffect(() => {
    fetchMemberDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookiesId, city]);

  const form = useForm<FormType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (values: FormType) => {
    const res = await registerMember({
      ...values,
      bookiesId: bookiesId,
      city: city,
    });

    if (res.success) {
      toast.success(`Registration Successful`, { style: TOAST_STYLES.SUCCESS });
      fetchMemberDetails();
    }
  };

  return (
    <div>
      <div className="bg-[#FFE6D5] p-6 flex justify-between items-center text-[#58551E]">
        <div>
          <h1 className="text-xl font-bold uppercase">{city} Bookies</h1>
          <p className="text-sm">Reading Community</p>
        </div>
        <div>
          <img src={BookiesLogo} className="size-15 cursor-pointer" alt="Bookies Logo" />
        </div>
      </div>

      <div className="bg-white rounded-md p-8 grid gap-6">
        {!isGetMemberDetailsLoading ? (
          memberDetails ? (
            <MemberDetails memberDetails={memberDetails} />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your first name"
                          className="py-6 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{ required: "First name is required" }}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your last name"
                          className="py-6 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{ required: "Last name is required" }}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="py-6 shadow-none text-base">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{ required: "Please select a gender" }}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          className="py-6 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  }}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your phone number"
                          className="py-6 shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  }}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="py-6 shadow-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{
                    required: "Date of birth is required",
                    validate: (value) => {
                      const selected = new Date(value);
                      const today = new Date();
                      return selected < today || "Date must be in the past";
                    },
                  }}
                />

                <Button
                  type="submit"
                  className="w-full py-6 bg-[#58551E]"
                  disabled={form.formState.isSubmitting}
                >
                  Submit
                </Button>
              </form>
            </Form>
          )
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};

export default Member;