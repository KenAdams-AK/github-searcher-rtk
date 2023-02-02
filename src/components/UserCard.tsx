import { dateFormat } from "../heplers/dateFormat";
import { User } from "../models/user.model";

type UserCardPropsT = {
	user: User;
};

export default function UserCard({ user }: UserCardPropsT) {
	if (!user) return null;

	return (
		<div className="UserCard__container">
			<div className="UserCard__image">
				<img src={user.avatarUrl} alt="photo" />
			</div>
			<div className="UserCard__info info">
				<div className="info__name">{user.name || user.login}</div>
				<div className="info__email">
					Email: {user.email ? user.email : "not provided"}
				</div>
				<div className="info__location">
					Location: {user.location ? user.location : "not provided"}
				</div>
				<div className="info__join-date">
					Join Date: {dateFormat.format(new Date(user.created))}
				</div>
				<div className="info__followers">{user.followers} Followers</div>
				<div className="info__following">Following {user.following}</div>
			</div>
			<div className="UserCard__bio">
				Bio: {user.bio ? user.bio : "not provided"}
			</div>
		</div>
	);
}
