import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import { useState } from "react";

import packageJson from "../../package.json";
import styles from "./index.module.css";

const INSTALL_COMMAND = "pnpm add -D @activatus/code-standards";
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
	const cardImageUrl = useBaseUrl("/images/code-standards-card.png");

	return (
		<Layout
			title="Code Standards"
			description="Practical frameworks, boilerplates and best practices for building with clarity."
		>
			<main className={styles.page}>
				<h1 className={styles.title}>Code Standards</h1>
				<p className={styles.blurb}>
					Practical frameworks, boilerplates and best practices for
					building with clarity.
				</p>

				<img
					className={styles.card}
					src={cardImageUrl}
					alt="A code editor next to a checklist with every item ticked"
					width={560}
					height={429}
				/>

				<div className={styles.actions}>
					<CopyInstallButton />
					<Link className={styles.docsButton} to="/docs">
						Read the docs
					</Link>
				</div>

				<p className={styles.version}>
					Version {packageJson.version}
				</p>

				<a className={styles.credit} href={ACTIVATUS_URL}>
					Made by Activatus
				</a>
			</main>
		</Layout>
	);
};

// Docusaurus finds a page only by its default export.
export default HomePage;
