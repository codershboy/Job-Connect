import React, { useState } from "react";
import { Avatar, Modal, Button, TextInput, PasswordInput, Select, Text, Alert, Textarea } from "@mantine/core";
import { IconUsb, IconBell, IconSettings, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { Indicator } from "@mantine/core";
import NavLinks from "./NavLinks";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

const Header = () => {
    const auth = useAuth();
    const [opened, setOpened] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<string | null>("APPLICANT");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Profile Settings state
    const [profileOpened, setProfileOpened] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [profileTitle, setProfileTitle] = useState("");
    const [profileSkills, setProfileSkills] = useState("");
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);

    const handleOpenProfile = () => {
        if (auth.user) {
            setProfileName(auth.user.name || "");
            setProfileTitle(auth.user.title || "");
            setProfileSkills(auth.user.skills || "");
            setProfileError("");
            setProfileSuccess(false);
            setProfileOpened(true);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess(false);
        setProfileLoading(true);
        try {
            const response = await apiClient.put("/users/profile", {
                name: profileName,
                title: profileTitle,
                skills: profileSkills
            });
            const updatedUser = response.data;
            auth.updateUser(updatedUser.name, updatedUser.title, updatedUser.skills);
            setProfileSuccess(true);
            setTimeout(() => {
                setProfileOpened(false);
                setProfileSuccess(false);
            }, 1500);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.details || "Failed to update profile.";
            setProfileError(msg);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isSignUp) {
                const response = await apiClient.post("/users/auth/register", {
                    name,
                    email,
                    password,
                    role
                });
                const data = response.data;
                auth.login(data.token, data.name, data.email, data.role, data.id, data.title, data.skills);
            } else {
                const response = await apiClient.post("/users/auth/login", {
                    email,
                    password
                });
                const data = response.data;
                auth.login(data.token, data.name, data.email, data.role, data.id, data.title, data.skills);
            }
            setOpened(false);
            resetForm();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.details || "Authentication failed. Please check inputs.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setName("");
        setRole("APPLICANT");
        setError("");
    };

    return (
        <div className="w-full bg-mine-shaft-950 px-6 text-white h-20 flex justify-between items-center shadow-lg border-b border-white/5">
            {/* Logo */}
            <div className="flex gap-1 items-center text-bright-sun-400 cursor-pointer">
                <IconUsb className="h-10 w-10" stroke={2}/>
                <div className="text-3xl font-semibold tracking-wide">JobConnect</div>
            </div>

            {/* Navigation links */}
            <NavLinks />

            {/* Right-side Auth section */}
            <div className="flex gap-5 items-center">
                {auth.isAuthenticated && auth.user ? (
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="font-semibold text-sm">{auth.user.name}</div>
                                <div className="text-xs text-bright-sun-400 font-medium capitalize">{auth.user.role.toLowerCase()}</div>
                            </div>
                            <Avatar src={null} alt={auth.user.name} color="bright-sun" radius="xl">
                                {auth.user.name.substring(0, 2).toUpperCase()}
                            </Avatar>
                        </div>
                        
                        <div 
                            onClick={handleOpenProfile}
                            className="bg-mine-shaft-900 p-1.5 rounded-full cursor-pointer hover:bg-mine-shaft-800 transition-colors"
                        >
                            <IconSettings stroke={1.5} size={20} />
                        </div>
                        
                        <div className="bg-mine-shaft-900 p-1.5 rounded-full cursor-pointer hover:bg-mine-shaft-800 transition-colors">
                            <Indicator color="bright-sun.4" offset={4} size={8} processing>
                                <IconBell stroke={1.5} size={20} />
                            </Indicator>
                        </div>

                        <Button 
                            variant="subtle" 
                            color="red" 
                            onClick={auth.logout}
                            className="hover:bg-red-500/10"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button 
                        color="bright-sun" 
                        variant="filled" 
                        onClick={() => { resetForm(); setOpened(true); }}
                        className="bg-bright-sun-400 hover:bg-bright-sun-500 text-mine-shaft-950 font-bold px-6 rounded-md"
                    >
                        Sign In
                    </Button>
                )}
            </div>

            {/* Auth Dialog */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={
                    <Text size="xl" fw={700} className="text-mine-shaft-50">
                        {isSignUp ? "Create your account" : "Welcome back"}
                    </Text>
                }
                centered
                size="md"
                styles={{
                    content: { backgroundColor: "#1e1e1e", color: "#f3f3f3" },
                    header: { backgroundColor: "#1e1e1e", borderBottom: "1px solid rgba(255,255,255,0.05)" },
                    close: { color: "#888", hover: { backgroundColor: "rgba(255,255,255,0.05)" } }
                }}
            >
                <form onSubmit={handleAuth} className="flex flex-col gap-4 mt-2">
                    {error && (
                        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" variant="filled">
                            {error}
                        </Alert>
                    )}

                    {isSignUp && (
                        <TextInput
                            label="Full Name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            styles={{
                                label: { color: "#b0b0b0" },
                                input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                            }}
                        />
                    )}

                    <TextInput
                        label="Email Address"
                        placeholder="your@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        styles={{
                            label: { color: "#b0b0b0" },
                            input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                        }}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        styles={{
                            label: { color: "#b0b0b0" },
                            input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                        }}
                    />

                    {isSignUp && (
                        <Select
                            label="Register As"
                            data={[
                                { value: "APPLICANT", label: "Job Seeker (Applicant)" },
                                { value: "EMPLOYER", label: "Employer (Post Jobs)" }
                            ]}
                            value={role}
                            onChange={setRole}
                            required
                            styles={{
                                label: { color: "#b0b0b0" },
                                input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" },
                                dropdown: { backgroundColor: "#2d2d2d", border: "1px solid #454545" }
                            }}
                        />
                    )}

                    <Button 
                        type="submit" 
                        loading={loading}
                        color="bright-sun"
                        className="bg-bright-sun-400 hover:bg-bright-sun-500 text-mine-shaft-950 font-bold mt-4"
                        fullWidth
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>

                    <Text size="sm" ta="center" className="text-mine-shaft-400 mt-2">
                        {isSignUp ? "Already have an account?" : "New to JobConnect?"}{" "}
                        <span 
                            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                            className="text-bright-sun-400 cursor-pointer hover:underline font-semibold"
                        >
                            {isSignUp ? "Sign In" : "Register here"}
                        </span>
                    </Text>
                </form>
            </Modal>

            {/* Profile Settings Modal */}
            <Modal
                opened={profileOpened}
                onClose={() => setProfileOpened(false)}
                title={
                    <Text size="xl" fw={700} className="text-mine-shaft-50">
                        Profile Settings
                    </Text>
                }
                centered
                size="md"
                styles={{
                    content: { backgroundColor: "#1e1e1e", color: "#f3f3f3" },
                    header: { backgroundColor: "#1e1e1e", borderBottom: "1px solid rgba(255,255,255,0.05)" },
                    close: { color: "#888", hover: { backgroundColor: "rgba(255,255,255,0.05)" } }
                }}
            >
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 mt-2">
                    {profileError && (
                        <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red" variant="filled">
                            {profileError}
                        </Alert>
                    )}

                    {profileSuccess && (
                        <Alert icon={<IconCheck size="1rem" />} title="Success" color="green" variant="filled">
                            Profile updated successfully!
                        </Alert>
                    )}

                    <TextInput
                        label="Full Name"
                        placeholder="Enter your name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        styles={{
                            label: { color: "#b0b0b0" },
                            input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                        }}
                    />

                    {auth.user?.role === "APPLICANT" && (
                        <>
                            <TextInput
                                label="Professional Title"
                                placeholder="e.g. React Developer"
                                value={profileTitle}
                                onChange={(e) => setProfileTitle(e.target.value)}
                                styles={{
                                    label: { color: "#b0b0b0" },
                                    input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                                }}
                            />

                            <Textarea
                                label="Skills (comma-separated)"
                                placeholder="e.g. React, JavaScript, TypeScript, CSS"
                                value={profileSkills}
                                onChange={(e) => setProfileSkills(e.target.value)}
                                description="List your key tech stack separated by commas to match with job postings"
                                styles={{
                                    label: { color: "#b0b0b0" },
                                    description: { color: "#888" },
                                    input: { backgroundColor: "#2d2d2d", color: "#fff", borderColor: "#454545" }
                                }}
                            />
                        </>
                    )}

                    <Button 
                        type="submit" 
                        loading={profileLoading}
                        color="bright-sun"
                        className="bg-bright-sun-400 hover:bg-bright-sun-500 text-mine-shaft-950 font-bold mt-4"
                        fullWidth
                    >
                        Save Changes
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default Header;