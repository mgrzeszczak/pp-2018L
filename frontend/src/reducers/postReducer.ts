import Post from "../model/post";
import { ActionType } from "../actions";

export interface PostData {
    posts: Post[];
}

export function postReducer(state: PostData = {
    posts: [
        new Post(1, "A", "I found a statistical analysis of Hollywood movie’s dialogue and I find it very interesting. In 80% of movies in this set men have more than 60% of all lines which are spoken! The database contains 2000 popular Hollywood movies in the last 30 years. What do you think? https://pudding.cool/2017/03/film-dialogue/"),
        new Post(2, "B", "Thank you for posting the link, I find the study quite intriguing. I don’t think that 60-40 split between the sexes is bad. Honestly, before reading the study I’d say the gap is wider. Considering the database goes back 30 years it could not show the real proportion of today’s films. There should be an option to select the dates for which I want to see the statistics."),
        new Post(3, "C", "I’d like to see such a study of films in the last 10 years. Even better if it would be correlated with this one."),
        new Post(4, "B", "Yeah, a study like this should be done. Last decade, or even last 5 years."),
        new Post(5, "D", "It would be interesting to see if the trend continues in the films written by females :D I don’t think so."),
        new Post(6, "B", "Or in anime :D"),
        new Post(7, "E", "I don’t think such a study should be done – it would show nothing, as this study does. Take Mulan, for example. This study says that the dragon spoke more words than her. It’s probably true because this character is very talkative, while Mulan Is a reserved and silent hero (still being a strong one), who represents female empowerment. So the information about the number of lines spoken by each character is useless without a context."),
        new Post(8, "A", "You can’t use one example to depreciate this study. Yes, I agree that in Mulan this statistic does not show which hero is the important one but if on average men get significantly more text than women do, then there is a problem of equality."),
        new Post(9, "E", "I am aware that as with all studies of this nature, the data collected only can point us in the direction of a larger discussion of an issue, it's up to the researchers, and ourselves, the readers, to determine exactly what that data means and what we should do with the information. But this particular study is just wrong – it uses a very subtle topic to get attention of readers, being slippery at the same time.")
    ]
}, action: any): PostData {
    switch (action.type) {
        case ActionType.ADD_NEW_POST:
            return {
                posts: [...state.posts, action.payload]
            };
        default:
            return state;
    }
}
