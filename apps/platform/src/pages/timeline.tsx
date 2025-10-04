import { HeadingBox } from "../components/shared/heading-box";
import { PostForm } from "../features/posts/components/post-form";

export const Timeline = () => {
	return (
		<main>
			<HeadingBox>
				<div>Timeline</div>
				<div>Newest</div>
			</HeadingBox>
			<PostForm />
		</main>
	);
};
