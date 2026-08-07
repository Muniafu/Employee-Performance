import { Ban } from "lucide-react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthCard from "../../components/Auth/AuthCard";

export default function AccountSuspended() {

    return (

        <AuthLayout>

            <AuthCard
                title="Account Suspended"
                subtitle="Your account has been temporarily disabled."
            >

                <div className="status-page">

                    <Ban
                        size={70}
                        className="status-icon suspended"
                    />

                    <p>

                        Your account has been suspended by
                        the system administrator.

                    </p>

                    <p>

                        Please contact your HR department
                        for assistance.

                    </p>

                    <Link
                        to="/login"
                        className="btn btn-primary"
                    >

                        Return to Login

                    </Link>

                </div>

            </AuthCard>

        </AuthLayout>

    );

}