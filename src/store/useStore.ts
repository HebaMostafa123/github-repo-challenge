import create from 'zustand';
import axios from 'axios';

export interface Repository {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  owner: {
    login: string;
  };
  viewer_has_starred: boolean;
}

interface State {
  repositories: Repository[];
  setRepositories: (repos: Repository[]) => void;
  fetchRepositories: (keyword: string) => Promise<void>;
  starRepository: (repo: Repository) => Promise<void>;
  unstarRepository: (repo: Repository) => Promise<void>;
}
const checkRateLimit = async () => {
    const token = process.env.REACT_APP_GITHUB_API_TOKEN;   
    try {
      const response = await axios.get('https://api.github.com/rate_limit', {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data.rate;
    } catch (error) {
      console.error("Failed to check rate limit:", error);
    }
  };
  
const useStore = create<State>((set, get) => ({
    repositories: [],
    setRepositories: (repos) => set({ repositories: repos }),
    
    fetchRepositories: async (keyword: string) => {
        const token = process.env.REACT_APP_GITHUB_API_TOKEN;
        const rateLimit = await checkRateLimit();
        if (rateLimit.remaining === 0) {
          console.warn(`Rate limit exceeded. Resets at: ${new Date(rateLimit.reset * 1000).toLocaleTimeString()}`);
          return;
        }
        try {
          const response = await axios.get(`https://api.github.com/search/repositories?q=${keyword}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          const reposWithStarredInfo = response.data.items.map((repo: any) => ({
            ...repo,
            viewer_has_starred: repo.stargazers_count || false,
          }));
          set({ repositories: reposWithStarredInfo });
        } catch (error) {
          console.error("Failed to fetch repositories:", error);
        }
    },
    
    starRepository: async (repo: Repository) => {
      const token = process.env.REACT_APP_GITHUB_API_TOKEN;
      const rateLimit = await checkRateLimit();
      if (rateLimit.remaining === 0) {
        console.warn(`Rate limit exceeded. Resets at: ${new Date(rateLimit.reset * 1000).toLocaleTimeString()}`);
        return;
      }
      try {
        await axios.put(
          `https://api.github.com/user/starred/${repo.owner.login}/${repo.name}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedRepositories = get().repositories.map((r) =>
          r.id === repo.id ? { ...r, stargazers_count: r.stargazers_count + 1, viewer_has_starred: true } : r
        );
        set({ repositories: updatedRepositories });
      } catch (error) {
        console.error("Failed to star repository:", error);
      }
    },
    
    unstarRepository: async (repo: Repository) => {
      const token = process.env.REACT_APP_GITHUB_API_TOKEN;
      const rateLimit = await checkRateLimit();
      if (rateLimit.remaining === 0) {
        console.warn(`Rate limit exceeded. Resets at: ${new Date(rateLimit.reset * 1000).toLocaleTimeString()}`);
        return;
      }
      try {
        await axios.delete(
          `https://api.github.com/user/starred/${repo.owner.login}/${repo.name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedRepositories = get().repositories.map((r) => {
          if (r.id === repo.id) {
            const newCount = r.stargazers_count > 0 ? r.stargazers_count - 1 : 0;
            return { ...r, stargazers_count: newCount, viewer_has_starred: false };
          }
          return r;
        });
        set({ repositories: updatedRepositories });
      } catch (error) {
        console.error("Failed to unstar repository:", error);
      }
    },
  }));

export default useStore;
