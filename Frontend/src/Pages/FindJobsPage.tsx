import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import ApplyModal from "../components/ApplyModal";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { Loader, Autocomplete, Button, Group, Text, Card, Badge, Stack, Pagination } from "@mantine/core";
import { IconSearch, IconMapPin, IconCurrencyRupee, IconBriefcase, IconTarget, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

interface EmployerInfo {
  id: number;
  name: string;
  email: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  employer: EmployerInfo | null;
  skills?: string | null;
}

const calculateMatchScore = (jobSkillsStr: string | null | undefined, userSkillsStr: string | null | undefined) => {
  if (!jobSkillsStr) return { score: 100, matched: [], missing: [] };
  
  const jobSkills = jobSkillsStr.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  if (jobSkills.length === 0) return { score: 100, matched: [], missing: [] };
  
  if (!userSkillsStr) {
    const jobSkillsOriginal = jobSkillsStr.split(",").map(s => s.trim()).filter(Boolean);
    return { score: 0, matched: [], missing: jobSkillsOriginal };
  }
  
  const userSkills = userSkillsStr.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const jobSkillsOriginal = jobSkillsStr.split(",").map(s => s.trim()).filter(Boolean);
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  jobSkillsOriginal.forEach((skill) => {
    if (userSkills.includes(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });
  
  const score = Math.round((matched.length / jobSkillsOriginal.length) * 100);
  return { score, matched, missing };
};

const JobCard = ({ job, auth, onApply }: { job: Job; auth: any; onApply: (job: Job) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const match = calculateMatchScore(job.skills, auth.user?.skills);

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      styles={{
        root: { 
          backgroundColor: "#ffffff", 
          borderColor: "#e2e8f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }
      }}
      className="hover:border-indigo-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-2xl"
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <div className="max-w-[60%]">
            <Text fw={700} size="lg" c="#0f172a" className="truncate">
              {job.title}
            </Text>
            <Text size="xs" c="#64748b" className="font-medium mt-0.5 truncate">
              Posted by: {job.employer?.name || "Corporate Partner"}
            </Text>
          </div>
          <Group gap="xs">
            <Badge color="indigo" variant="light" className="font-semibold">
              Full Time
            </Badge>
            {auth.isAuthenticated && auth.user?.role === "APPLICANT" && (
              <Badge 
                color={match.score >= 70 ? "teal" : match.score >= 40 ? "orange" : "gray"} 
                variant="filled" 
                className="font-bold"
              >
                {match.score}% Match
              </Badge>
            )}
          </Group>
        </Group>

        <Text size="sm" c="#334155" className="line-clamp-3 mt-2">
          {job.description}
        </Text>

        {/* Dynamic Skill Matching Info Panel */}
        {auth.isAuthenticated && auth.user?.role === "APPLICANT" && (
          <div className="mt-2 border-t border-slate-100 pt-2">
            <Button
              variant="subtle"
              color="indigo"
              size="xs"
              leftSection={expanded ? <IconChevronUp size="0.9rem" /> : <IconChevronDown size="0.9rem" />}
              onClick={() => setExpanded(!expanded)}
              className="p-0 h-auto text-xs hover:bg-transparent"
            >
              {expanded ? "Hide Skill Fit" : "Show Skill Fit"}
            </Button>

            {expanded && (
              <div className="mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-800 text-xs">
                <div className="font-semibold text-slate-700 flex items-center gap-1 mb-1.5">
                  <IconTarget size={14} className="text-indigo-600" />
                  Compatibility: {match.score}%
                </div>
                
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mb-2.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      match.score >= 70 ? "bg-teal-500" : match.score >= 40 ? "bg-amber-500" : "bg-slate-400"
                    }`}
                    style={{ width: `${match.score}%` }}
                  />
                </div>

                {match.matched.length > 0 && (
                  <div className="mb-2">
                    <span className="font-medium text-slate-600 block mb-1">Matched Skills ({match.matched.length}):</span>
                    <div className="flex flex-wrap gap-1">
                      {match.matched.map((s, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {match.missing.length > 0 ? (
                  <div>
                    <span className="font-medium text-slate-600 block mb-1">Missing Skills ({match.missing.length}):</span>
                    <div className="flex flex-wrap gap-1">
                      {match.missing.map((s, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          + {s}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 italic block mt-1.5">
                      💡 Tip: Add these to your profile to increase match rate!
                    </span>
                  </div>
                ) : (
                  <div className="text-emerald-600 font-medium text-[10px] flex items-center gap-1 mt-1">
                    ✓ Perfect match! You have all required skills.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Stack>

      <Stack className="mt-4 pt-3 border-t border-slate-100" gap="xs">
        <Group gap="xs" c="#475569" className="text-sm">
          <IconMapPin size="1.1rem" className="text-indigo-600" />
          <span>{job.location}</span>
        </Group>
        
        <Group gap="xs" c="#475569" className="text-sm">
          <IconCurrencyRupee size="1.1rem" className="text-indigo-600" />
          <span className="font-semibold">₹{job.salary.toLocaleString("en-IN")} / year</span>
        </Group>

        <Button 
          onClick={() => onApply(job)}
          fullWidth 
          color="indigo" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold mt-2"
        >
          Apply Now
        </Button>
      </Stack>
    </Card>
  );
};

const FindJobsPage = () => {
  const auth = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Search parameters
  const [titleQuery, setTitleQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [appliedTitle, setAppliedTitle] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");

  // Pagination
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  // Apply Modal state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyOpened, setApplyOpened] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.get("/jobs", {
        params: {
          title: appliedTitle,
          location: appliedLocation,
          page: activePage - 1,
          size: pageSize,
          sort: "id,desc"
        }
      });
      setJobs(response.data.content);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      setError("Failed to fetch jobs. Please verify your backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedTitle, appliedLocation, activePage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePage(1);
    setAppliedTitle(titleQuery);
    setAppliedLocation(locationQuery);
  };

  const handleClear = () => {
    setTitleQuery("");
    setLocationQuery("");
    setActivePage(1);
    setAppliedTitle("");
    setAppliedLocation("");
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setApplyOpened(true);
  };

  return (
    <div className="min-h-[100vh] bg-mine-shaft-950 text-white pb-16">
      <Header />
      
      {/* Search Header Section */}
      <div className="bg-mine-shaft-900 border-b border-white/5 py-10 px-16 shadow-inner">
        <div className="max-w-5xl mx-auto">
          <Text size="xl" fw={700} className="mb-4 text-bright-sun-400">
            Explore Thousands of Tech Careers
          </Text>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 bg-mine-shaft-950 p-3 rounded-xl border border-white/10 shadow-xl">
            <Autocomplete
              placeholder="Job Title, Skills, or Keyword"
              leftSection={<IconSearch size="1.2rem" className="text-mine-shaft-400" />}
              value={titleQuery}
              onChange={setTitleQuery}
              data={["Software Engineer", "React Developer", "Java Developer", "Frontend Developer", "Backend Developer", "Full-Stack Developer", "Data Scientist", "DevOps Engineer", "Product Manager", "UI/UX Designer", "iOS Developer", "SRE", "Cloud Architect"]}
              className="flex-1"
              styles={{
                input: { backgroundColor: "transparent", color: "#fff", border: "none" },
                dropdown: { backgroundColor: "#2d2d2d", border: "1px solid #454545" }
              }}
            />
            
            <div className="w-px bg-white/10 hidden md:block"></div>
            
            <Autocomplete
              placeholder="City, State, or Remote"
              leftSection={<IconMapPin size="1.2rem" className="text-mine-shaft-400" />}
              value={locationQuery}
              onChange={setLocationQuery}
              data={["Bangalore, Karnataka", "Mumbai, Maharashtra", "Delhi NCR", "Hyderabad, Telangana", "Chennai, Tamil Nadu", "Pune, Maharashtra", "Kolkata, West Bengal", "Gurugram, Haryana", "Noida, Uttar Pradesh", "Remote, India"]}
              className="flex-1"
              styles={{
                input: { backgroundColor: "transparent", color: "#fff", border: "none" },
                dropdown: { backgroundColor: "#2d2d2d", border: "1px solid #454545" }
              }}
            />

            <Group justify="flex-end">
              <Button variant="subtle" color="gray" onClick={handleClear} className="hover:bg-white/5">
                Clear
              </Button>
              <Button type="submit" color="bright-sun" className="bg-bright-sun-400 hover:bg-bright-sun-500 text-mine-shaft-950 font-bold px-8">
                Search
              </Button>
            </Group>
          </form>
        </div>
      </div>

      {/* Main Jobs Listing */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader color="bright-sun" size="xl" />
            <Text className="text-mine-shaft-300">Retrieving active positions...</Text>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center max-w-lg mx-auto">
            <Text fw={600} color="red" className="mb-2">Connectivity Error</Text>
            <Text size="sm" className="text-mine-shaft-300">{error}</Text>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-mine-shaft-900 rounded-2xl border border-white/5 shadow-md">
            <IconBriefcase size={64} className="text-mine-shaft-500 mx-auto mb-4" />
            <Text size="lg" fw={600} className="text-mine-shaft-200">No Jobs Found</Text>
            <Text size="sm" className="text-mine-shaft-400 mt-1">We couldn't find any job postings matching your query. Try broadening your keywords!</Text>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  auth={auth} 
                  onApply={handleApplyClick} 
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Group justify="center" className="mt-12">
                <Pagination 
                  value={activePage} 
                  onChange={setActivePage} 
                  total={totalPages} 
                  color="bright-sun"
                  styles={{
                    control: { 
                      backgroundColor: "#1e1e1e", 
                      color: "#fff", 
                      border: "1px solid rgba(255,255,255,0.05)",
                      hover: { backgroundColor: "#2d2d2d" }
                    }
                  }}
                />
              </Group>
            )}
          </div>
        )}
      </div>

      {/* Apply Form Dialog */}
      {selectedJob && (
        <ApplyModal
          opened={applyOpened}
          onClose={() => setApplyOpened(false)}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
        />
      )}
    </div>
  );
};

export default FindJobsPage;
