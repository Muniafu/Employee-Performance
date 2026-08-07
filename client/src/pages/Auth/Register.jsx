import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/Auth/AuthLayout";
import AuthCard from "../../components/Auth/AuthCard";
import PasswordInput from "../../components/Auth/PasswordInput";
import PasswordStrength from "../../components/Auth/PasswordStrength";
import FormInput from "../../components/FormInput";

import { useAuth } from "../../context/useAuth";

export default function Register() {
    const navigate = useNavigate();

    const { register } = useAuth();

    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        salary: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validateStep = () => {
        const e = {};

        if(step===1){
            if(!form.firstName.trim())
                e.firstName="First name is required";

            if(!form.lastName.trim())
                e.lastName="Last name is required";

            if(!form.email.trim())
                e.email="Email is required";
        }

        if(step===2){
            if(!form.department.trim())
                e.department="Department is required";

            if(!form.position.trim())
                e.position="Position is required";
        }

        if(step===3){
            if(form.password.length<6)
                e.password="Password must contain at least 6 characters";

            if(form.password!==form.confirmPassword)
                e.confirmPassword="Passwords do not match";
        }

        setErrors(e);

        return Object.keys(e).length===0;

    };

    const nextStep=()=>{
        if(validateStep()){
            setStep((s) => s + 1);
        }
    };

    const previousStep=()=>{
        setStep((s) => s - 1);
    };
    
    const submit=async(e)=>{
        e.preventDefault();

        if(!validateStep())
            return;

        try{

            setLoading(true);

            const response=
                await register({
                    firstName:form.firstName,
                    lastName:form.lastName,
                    email:form.email,
                    phone:form.phone,
                    department:form.department,
                    position:form.position,
                    salary:Number(form.salary),
                    password:form.password,
                });

            if(
                response.data.data.approved
            ){
                navigate("/dashboard");
            }else{
                navigate("/pending-approval");
            }

        }catch(err){

            setErrors({
                general:
                    err.response?.data?.message
                    ||
                    "Registration failed."

            });

        }finally{

            setLoading(false);

        }
    };

    return (

        <AuthLayout>
            <AuthCard
            title="Create Account"
            subtitle="Register your employee account">
                <form
                    className="auth-form"
                    onSubmit={submit}
                >
                    
                    <div className="wizard">
                        

                        <div className={step>=1?"wizard-step active":"wizard-step"}>
                            <span>1</span>
                            <small>Personal</small>
                        </div>

                        <div className={step>=2?"wizard-step active":"wizard-step"}>
                            <span>2</span>
                            <small>Employment</small>
                        </div>

                        <div className={step>=3?"wizard-step active":"wizard-step"}>
                            <span>3</span>
                            <small>Security</small>
                        </div>

                    </div>

        {
        errors.general &&

        <div className="auth-error">

        {errors.general}

        </div>

        }

        {
        step===1 &&

        <>

        <FormInput
        label="First Name"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        error={errors.firstName}
        />

        <FormInput
        label="Last Name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        error={errors.lastName}
        />

        <FormInput
        className="form-control"
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        />

        <FormInput
        label="Phone"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        />

        <button
        type="button"
        className="btn btn-primary"
        onClick={nextStep}>

        Continue

        </button>

        </>

        }

        {
        step===2 &&

        <>

        <FormInput
        label="Department"
        name="department"
        value={form.department}
        onChange={handleChange}
        error={errors.department}
        />

        <FormInput
        label="Position"
        name="position"
        value={form.position}
        onChange={handleChange}
        error={errors.position}
        />

        <FormInput
        label="Salary"
        name="salary"
        type="number"
        value={form.salary}
        onChange={handleChange}
        />

        <div className="wizard-buttons">

        <button
        type="button"
        className="btn btn-secondary"
        onClick={previousStep}>

        Back

        </button>

        <button
        type="button"
        className="btn btn-primary"
        onClick={nextStep}>

        Continue

        </button>

        </div>

        </>

        }

        {
        step===3 &&

        <>

        <PasswordInput
        className="form-control"
        label="Password"
        value={form.password}
        onChange={(e)=>
        setForm({
        ...form,
        password:e.target.value
        })
        }
        error={errors.password}
        />
        <PasswordStrength password={form.password}
        />

        <PasswordInput
        className="form-control"
        label="Confirm Password"
        value={form.confirmPassword}
        onChange={(e)=>
        setForm({
        ...form,
        confirmPassword:e.target.value
        })
        }
        error={errors.confirmPassword}
        />
        <div className="wizard-buttons">

        <button
        type="button"
        className="btn btn-secondary"
        onClick={previousStep}>

        Back

        </button>

        <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}>

        {
        loading
        ?
        "Creating Account..."
        :
        "Create Account"
        }

        </button>

        </div>

        </>

        }

        <div className="register-link">

        Already have an account?

        <Link to="/login">

        Sign In

        </Link>

        </div>

        </form>

        </AuthCard>

        </AuthLayout>

    );
}