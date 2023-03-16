export type Props = {
  name: string;
  description: string;
};

export default function StoreHeader({ name, description }: Props) {
  return (
    <div className="bg-white pt-12 sm:pt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {name}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}