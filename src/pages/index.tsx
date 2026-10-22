import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import MDXContent from "@theme/MDXContent";
import { useState } from "react";

import ReadmeContent from "../../README.md";
import packageJson from "../../package.json";
import styles from "./index.module.css";

const DESCRIPTION =
	"A copy and paste config for humans and AI to follow, so code is human-readable, easy to debug and maintains strong industry standards.";
const INSTALL_COMMAND =
	"pnpm add -D @activatus/code-standards@latest";
const COPIED_MESSAGE_MILLISECONDS = 2000;
const ACTIVATUS_URL = "https://github.com/activatus-life";

const CopyInstallButton = () => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyClick = async () => {
		await navigator.clipboard.writeText(INSTALL_COMMAND);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), COPIED_MESSAGE_MILLISECONDS);
	};

	return (
		<button
			type="button"
			className={styles.installButton}
			onClick={handleCopyClick}
			aria-label={`Copy the install command: ${INSTALL_COMMAND}`}
		>
			<code className={styles.installCommand}>{INSTALL_COMMAND}</code>
			<span className={styles.copyLabel}>
				{isCopied ? "Copied" : "Copy"}
			</span>
		</button>
	);
};

const HomePage = () => {
	const cardImageUrl = useBaseUrl("/images/code-standards-card.jpg");

	return (
		<Layout title="Code Standards" description={DESCRIPTION}>
			<main className={styles.page}>
				<div className={styles.hero}>
					<section className={styles.card}>
						<div className={styles.cardText}>
							<h1 className={styles.title}>Code Standards</h1>
							<p className={styles.description}>{DESCRIPTION}</p>
						</div>
						<img
							className={styles.cardImage}
							src={cardImageUrl}
							alt="A code editor next to a checklist with every item ticked"
							width={920}
							height={760}
						/>
					</section>

					<div className={styles.actions}>
						<CopyInstallButton />
						<Link className={styles.docsButton} to="/docs">
							Read the docs
						</Link>
					</div>
				</div>

				<article className={`markdown ${styles.readme}`}>
					<MDXContent>
						<ReadmeContent />
					</MDXContent>
				</article>

				<p className={styles.footer}>
					<a href={ACTIVATUS_URL}>Made by Activatus</a>
					<span aria-hidden="true"> | </span>
					Version {packageJson.version}
				</p>
			</main>
		</Layout>
	);
};

// Docusaurus finds a page only by its default export.
export default HomePage;
