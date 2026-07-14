type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-5xl font-bold text-white">
        {title}
      </h1>

      <p className="mt-3 text-zinc-400">
        {description}
      </p>
    </div>
  );
}