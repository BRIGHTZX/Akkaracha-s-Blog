import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BiLoader } from "react-icons/bi";
import Oauth from "@/components/Oauth";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (event) => {
    // Prevent default form submission
    if (event) event.preventDefault;

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await axios.post("/api/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      if (!(res.status >= 200 && res.status < 300)) {
        return setErrorMessage(data.message);
      }

      setLoading(false);
      if (res.status >= 200 && res.status < 300) {
        navigate("/SignIn");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen mt-20">
        <MaxWidthWrapper>
          <div className="flex items-center mx-auto max-w-4xl flex-col xl:flex-row">
            {/* Left Side */}
            <div className="flex-1 p-4 text-center xl:text-start">
              <Link to="/">
                <div className="font-bold text-4xl">
                  <span className="rounded-lg bg-primary p-2 text-secondary">
                    Akkaracha &apos;s
                  </span>{" "}
                  Blog
                </div>
              </Link>
              <p className="text-sm mt-5">
                This is a demo project. You can sign in with your email and
                password or with Google
              </p>
            </div>
            {/* Right Side */}
            <div className="flex-1 container">
              <div className="lg:w-full mx-auto">
                <div className="rounded-lg shadow-xk bg-secondary text-primary py-10 md:py-12 px-6">
                  <div className="">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                      >
                        <label className="font-bold text-4xl">Sign Up</label>
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input
                                  id="username"
                                  placeholder="Enter your Username"
                                  className="border border-gray-300 rounded-md p-2"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e); // This calls React Hook Form's internal onChange
                                    handleChange(e); // This is your custom onChange handler
                                  }}
                                />
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
                                  id="email"
                                  placeholder="Enter your Email"
                                  className="border border-gray-300 rounded-md p-2"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e); // This calls React Hook Form's internal onChange
                                    handleChange(e); // This is your custom onChange handler
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  id="password"
                                  placeholder="Enter your Password"
                                  className="border border-gray-300 rounded-md p-2"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e); // This calls React Hook Form's internal onChange
                                    handleChange(e); // This is your custom onChange handler
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full bg-blue-600 text-white"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <BiLoader />
                              <span className="pl-3">Loadding...</span>
                            </>
                          ) : (
                            "Sign Up"
                          )}
                        </Button>

                        <Oauth />
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm mt-5">
                <span>Have an account?</span>
                <Link
                  to="/SignIn"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Button variant="link" className="text-blue-500">
                    Sign In
                  </Button>
                </Link>
              </div>
              <div>
                {errorMessage && (
                  <Alert>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}

export default SignUp;
