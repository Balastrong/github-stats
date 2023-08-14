import { pullRequests } from "@/graphql/queries";
import { useGitHubQuery } from "./useGitHubQuery";
import { PullRequestContributionsByRepository } from "@/types/github";
import { useMemo } from "react";

export const useGitHubPullRequests = (year: number, login: string) => {
  const params = useMemo(() => {
    return {
      from: `${year}-01-01T00:00:00`,
      login,
    };
  }, [year, login]);

  const { data, isLoading } = useGitHubQuery(pullRequests, params);

  const repositories: PullRequestContributionsByRepository[] =
    data?.user?.contributionsCollection?.pullRequestContributionsByRepository;

  return { repositories, isLoading };
};
