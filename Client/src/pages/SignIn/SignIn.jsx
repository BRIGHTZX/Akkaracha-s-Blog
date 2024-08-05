import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";

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
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  console.log(formData);
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

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields"));
    }

    try {
      dispatch(signInStart());

      const res = await axios.post("/api/auth/signin", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;

      if (!(res.status >= 200 && res.status < 300)) {
        return dispatch(signInFailure(data.message));
      }

      if (res.status >= 200 && res.status < 300) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(
        signInFailure(
          error.response ? error.response.data.message : error.message
        )
      );
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
                        <label className="font-bold text-4xl">Sign In</label>
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
                        <div>
                          <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white mt-4"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <BiLoader />
                                <span className="pl-3">Loadding...</span>
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                  <div>
                    <Oauth />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm mt-5">
                <span>Have an account?</span>
                <Link
                  to="/SignUp"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Button variant="link" className="text-blue-500">
                    Sign Up
                  </Button>
                </Link>
              </div>
              <div>
                {errorMessage && (
                  <div className="mt-4">
                    <Alert variant="destructive">
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}

export default SignIn;
