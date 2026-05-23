import { getSiteVersion } from "./common_fa";

type InjectionPointPath<T> = {
    [P in keyof T]: string;
};

interface InjectionVersions {
    classic: InjectionPointPath<InjectionPoints>;
    beta: InjectionPointPath<InjectionPoints>;
}

interface InjectionPoints {
    downloadInsertPosition: HTMLDivElement;
    downloadLink: HTMLAnchorElement;
    artistLink: HTMLAnchorElement;
    addFavoriteLink: HTMLAnchorElement;
    miniGallery: HTMLElement;
    journalHighlightMatch: HTMLLIElement;
    submissionHighlightMatch: HTMLAnchorElement;
    standardSubmissionLink: HTMLAnchorElement;
    openInTabsInsertPositionSubmissions: HTMLDivElement;
    openInTabsInsertPositionGallery: HTMLDivElement;
    openInTabsInsertPositionFavorites: HTMLDivElement;
    openInGDocsInsertPosition: HTMLElement;
}

export type InjectionPoint = keyof InjectionPoints;

const InjectionPointList: InjectionVersions = {
    "classic": {
        "downloadInsertPosition": "#page-submission .maintable:first th.cat",
        "downloadLink": "#page-submission div.actions a:contains('Download')",
        "artistLink": "#page-submission table.maintable td.cat div.information a[href*='/user/']",
        "addFavoriteLink": "a[href^='/fav/']:contains('+Add to Favorites')",
        "miniGallery": "#page-submission div.minigalleries",
        "journalHighlightMatch": "#messages-journals ul.message-stream li",
        "submissionHighlightMatch": "#messagecenter-submissions section.gallery figure",
        "standardSubmissionLink": "figure a[href*='/view/']",
        "openInTabsInsertPositionSubmissions": "#messagecenter-submissions div.actions",
        "openInTabsInsertPositionGallery": "#page-galleryscraps div.page-options",
        "openInTabsInsertPositionFavorites": "#favorites table.maintable>tbody>tr>td>table>tbody>tr:nth-child(1)>td:nth-child(1)",
        "openInGDocsInsertPosition": "#page-submission div.actions a:contains('Download')"
    },
    "beta": {
        "downloadInsertPosition": "#submission_page #submission-main-content > div:nth-child(2)",
        "downloadLink": "#submission_page #submission-options a[href*='d.furaffinity.net/']",
        "artistLink": "#submission_page div.submission-description-artist a[href*='/user/']",
        "addFavoriteLink": "#submission_page #submission-options a[href^='/fav/']",
        "miniGallery": "#submission_page #minigallery",
        "journalHighlightMatch": "#messages-journals ul.message-stream li",
        "submissionHighlightMatch": "#messagecenter-submissions section.gallery figure",
        "standardSubmissionLink": ".gallery-section figure a[href*='/view/']",
        "openInTabsInsertPositionSubmissions": "#messagecenter-new-submissions .actions-section div.aligncenter",
        "openInTabsInsertPositionGallery": "#page-galleryscraps div.submission-list div.aligncenter",
        "openInTabsInsertPositionFavorites": "#standardpage div.aligncenter:first-child",
        "openInGDocsInsertPosition": "#submission_page section.buttons"
    }
};

export function getInjectionPoint(point: keyof InjectionPoints): string {
    const ver = getSiteVersion();
    return InjectionPointList[ver][point];
}

export function getInjectionElement<T extends keyof InjectionPoints, Y extends InjectionPoints[T]>(point: T): JQuery<Y> {
    const target = getInjectionPoint(point);
    return jQuery<Y>(target);
}
