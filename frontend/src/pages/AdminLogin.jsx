import LoginCard from "../components/auth/LoginCard";

const AdminLogin = () => {
  return (
    <LoginCard
      title="Admin Login"
      description="Government admins can log in here to add victims, search records, and manage database tables."
      expectedRole="admin"
      successPath="/admin"
      wrongRolePath="/user/login"
      wrongRoleMessage="This account is a user account. Please use User Login."
    />
  );
};

export default AdminLogin;
