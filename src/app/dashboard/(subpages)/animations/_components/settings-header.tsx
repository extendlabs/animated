import FadeUp from "@/components/fadeup";

export const SettingsHeader = () => (
    <div className="relative mx-auto max-w-2xl text-center lg:max-w-4xl">
        <FadeUp delay={0.2} duration={0.8}>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Your animations</h1>
        </FadeUp>
        <FadeUp delay={0.4} duration={0.8}>
            <p className="mx-2 my-6 max-w-2xl text-base font-light tracking-tight dark:text-zinc-300 sm:text-xl">
                Select your slides and themes.
            </p>
        </FadeUp>
    </div>
);