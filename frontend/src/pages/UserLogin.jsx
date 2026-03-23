import LoginCard from "../components/auth/LoginCard";

const UserLogin = () => {
  return (
    <LoginCard
      title="User Login"
      description="Regular users can log in here to search victims by name and donate to the government relief effort."
      expectedRole="user"
      successPath="/user"
      wrongRolePath="/admin/login"
      wrongRoleMessage="This account is an admin account. Please use Admin Login."
    />
  );
};

export default UserLogin;
