import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useGitHubPullRequests, useHandleStateRepositories } from "@/hooks";
import { CardSkeleton, FormatStatsRender, ReposFilters } from "@/components";
import {
  PullRequestState,
  RepositoryOrder,
  RepositoryRenderFormat,
} from "@/types/github";

export default function Stats() {
  const { data: session } = useSession();
  const router = useRouter();
  const { login } = router.query;
  const baseYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(baseYear);
  const [format, setFormat] = useState<RepositoryRenderFormat>("cards");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pullRequestState, setpullRequestState] = useState<PullRequestState>(
    null!
  );
  const [repositoriesOrder, setRepositoriesOrder] = useState<RepositoryOrder>(
    null!
  );
  const [hideOwnRepo, setHideOwnRepo] = useState<boolean>(false);

  const { repositories, isLoading } = useGitHubPullRequests(
    year,
    login as string
  );

  const filteredRepositories = useHandleStateRepositories(
    repositories,
    searchQuery,
    hideOwnRepo,
    pullRequestState,
    repositoriesOrder
  );

  useEffect(() => {
    if (session && session.user && session.user.login !== login) {
      router.replace(`/stats/${session.user.login}`);
    }
  }, [session, login, router]);

  return (
    <div className="h-full w-full px-4 flex flex-col gap-4">
      <div className="mt-4">
        <h2 className="text-3xl text-center">
          {session?.user.name &&
            session?.user.login &&
            `${session.user.name} (${session.user.login})`}
        </h2>
      </div>
      <ReposFilters
        pullRequestState={pullRequestState!}
        setpullRequestState={setpullRequestState}
        repositoriesOrder={repositoriesOrder}
        setRepositoriesOrder={setRepositoriesOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        baseYear={baseYear}
        year={year}
        setYear={setYear}
        hideOwnRepo={hideOwnRepo}
        setHideOwnRepo={setHideOwnRepo}
        format={format}
        setFormat={setFormat}
      />
      {isLoading ? (
        <div className="w-full grid xl:grid-cols-3 gap-3 mb-3 md:grid-cols-2 ">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <FormatStatsRender
          repositories={filteredRepositories}
          format={format}
        />
      )}
    </div>
  );
}
