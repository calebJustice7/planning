import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth, useGetGoogleRedirect } from "../../queries/Auth";
import GoogleLogo from "../../images/google-logo.webp";

function GoogleLogin() {
  const navigate = useNavigate();
  const authQuery = useAuth();
  const query = useGetGoogleRedirect(localStorage.getItem("redirect"));

  useEffect(() => {
    if (authQuery.data && !authQuery.isLoading && !authQuery.isFetching) {
      navigate({ to: "/" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authQuery.data]);

  return (
    <div className="h-screen md:flex items-center">
      <div className="bg-slate-950 md:h-screen md:w-5/12 md:p-20 p-10 flex flex-col justify-between sm:w-screen">
        <div>
          <div className="text-4xl md:text-6xl mb-1">Planned.</div>
          <div>The most inclusive personal organization system.</div>
        </div>
        <div className="mt-10">
          Track your goals, plan your days, and check your progress. Built for the organized person
        </div>
        <div className="mt-10">Join now for free, Q4 2024 Planned will start charging 2.99 a month.</div>
      </div>

      <div className="mx-auto text-center mt-10 md:mt-0">
        {query.data && (
          <Link to={query.data || ""}>
            <button className="btn btn-info rounded-md" disabled={!query.data || authQuery.isLoading}>
              <span>Login with Google</span> <img src={GoogleLogo} alt="Google Logo" className="w-6 h-6" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default GoogleLogin;
