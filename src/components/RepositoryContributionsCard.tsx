import { Contributions, Repository } from "@/types/github";
import Image from "next/image";

export const RepositoryContributionsCard = ({
  repository,
  contributions: { totalCount, nodes },
}: {
  repository: Repository;
  contributions: Contributions;
}) => {
  return (
    <div className="card bg-slate-700">
      <div className="card-body">
        <h2 className="card-title flex justify-between">
          <div className="flex justify-center items-center gap-2">
            <Image
              src={repository.owner.avatarUrl}
              alt={repository.owner.login}
              width={40}
              height={40}
              className="rounded-full"
            />
            {repository.owner.login}/{repository.name}
          </div>
          <div>{totalCount}</div>
        </h2>
        <div className="max-h-[200px] overflow-auto flex flex-col gap-1 px-1">
          {nodes?.map(({ pullRequest: { state, title, id } }: any) => (
            <div key={id} className="flex justify-between gap-2">
              <span>{title}</span>
              <span>{state}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
