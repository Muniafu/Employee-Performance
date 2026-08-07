import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthCard from "../../components/Auth/AuthCard";

export default function AccountRejected() {

    return (

        <AuthLayout>

            <AuthCard
                title="Registration Rejected"
                subtitle="Your account request was not approved."
            >

                <div className="status-page">

                    <XCircle
                        size={70}
                        className="status-icon rejected"
                    />

                    <p>

                        Unfortunately your registration
                        request was rejected.

                    </p>

                    <p>

                        Contact your HR Administrator if
                        you believe this was a mistake.

                    </p>

                    <Link
                        to="/login"
                        className="btn btn-primary"
                    >

                        Back to Login

                    </Link>

                </div>

            </AuthCard>

        </AuthLayout>

    );

}