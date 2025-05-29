# API Query Parameters

## 1. format
- **Type**: enum
- **Default**: `json`
- **Allowed Values**: `csv`, `json`
- **Description**:
  - Must be one of the following:
    - `csv`: Returns a CSV table with one page of study data; the first page includes a header with column names; available fields are listed on the [CSV Download](/data-api/about-api/csv-download) page.
    - `json`: Returns JSON with one page of study data; every study object is placed in a separate line; `markup` type fields format depends on the `markupFormat` parameter.

## 2. markupFormat
- **Type**: enum
- **Default**: `markdown`
- **Allowed Values**: `markdown`, `legacy`
- **Description**:
  - Format of `markup` type fields:
    - `markdown`: [Markdown](https://spec.commonmark.org/0.28/) format.
    - `legacy`: Compatible with classic PRS.
  - Applicable only to `json` format.

## 3. query.cond
- **Type**: string
- **Examples**: `lung cancer`, `(head OR neck) AND pain`
- **Description**:
  - "Conditions or disease" query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).
  - See "ConditionSearch Area" on [Search Areas](/data-api/about-api/search-areas#ConditionSearch) for more details.

## 4. query.term
- **Type**: string
- **Example**: `AREA[LastUpdatePostDate]RANGE[2023-01-15,MAX]`
- **Description**:
  - "Other terms" query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).
  - See "BasicSearch Area" on [Search Areas](/data-api/about-api/search-areas#BasicSearch) for more details.

## 5. query.locn
- **Type**: string
- **Description**:
  - "Location terms" query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).
  - See "LocationSearch Area" on [Search Areas](/data-api/about-api/search-areas#LocationSearch) for more details.

## 6. query.titles
- **Type**: string
- **Description**:
  - "Title / acronym" query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).
  - See "TitleSearch Area" on [Search Areas](/data-api/about-api/search-areas#TitleSearch) for more details.

## 7. query.intr
- **Type**: string
- **Description**:
  - "Intervention / treatment" query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).
  - See "InterventionSearch Area" on [Search Areas](/data-api/about-api/search-areas#InterventionSearch) for more details.

## 8. query.outc
- **Type**: string
- **Description**:
  - "Outcome measure" query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).
  - See "OutcomeSearch Area" on [Search Areas](/data-api/about-api/search-areas#OutcomeSearch) for more details.

## 9. query.spons
- **Type**: string
- **Description**:
  - "Sponsor / collaborator" query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).
  - See "SponsorSearch Area" on [Search Areas](/data-api/about-api/search-areas#SponsorSearch) for more details.

## 10. query.lead
- **Type**: string
- **Description**:
  - Searches in "LeadSponsorName" field.
  - See [Study Data Structure](/data-api/about-api/study-data-structure#LeadSponsorName) for more details.
  - The query is in [Essie expression syntax](/find-studies/constructing-complex-search-queries).

## 11. query.id
- **Type**: string
- **Description**:
  - "Study IDs" query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).
  - See "IdSearch Area" on [Search Areas](/data-api/about-api/search-areas#IdSearch) for more details.

## 12. query.patient
- **Type**: string
- **Description**:
  - See "PatientSearch Area" on [Search Areas](/data-api/about-api/search-areas#PatientSearch) for more details.

## 13. filter.overallStatus
- **Type**: array of string
- **Allowed Values**: `ACTIVE_NOT_RECRUITING`, `COMPLETED`, `ENROLLING_BY_INVITATION`, `NOT_YET_RECRUITING`, `RECRUITING`, `SUSPENDED`, `TERMINATED`, `WITHDRAWN`, `AVAILABLE`, `NO_LONGER_AVAILABLE`, `TEMPORARILY_NOT_AVAILABLE`, `APPROVED_FOR_MARKETING`, `WITHHELD`, `UNKNOWN`
- **Examples**: `[NOT_YET_RECRUITING, RECRUITING]`, `[COMPLETED]`
- **Description**:
  - Filter by comma- or pipe-separated list of statuses.

## 14. filter.geo
- **Type**: string
- **Pattern**: `^distance\(-?\d+(\.\d+)?,-?\d+(\.\d+)?,\d+(\.\d+)?(km|mi)?\)$`
- **Example**: `distance(39.0035707,-77.1013313,50mi)`
- **Description**:
  - Filter by geo-function. Currently, only the distance function is supported.
  - Format: `distance(latitude,longitude,distance)`.

## 15. filter.ids
- **Type**: array of string
- **Example**: `[NCT04852770, NCT01728545, NCT02109302]`
- **Description**:
  - Filter by comma- or pipe-separated list of NCT IDs (a.k.a. ClinicalTrials.gov identifiers).
  - The provided IDs will be searched in [NCTId](/data-api/about-api/study-data-structure#NCTId) and [NCTIdAlias](/data-api/about-api/study-data-structure#NCTIdAlias) fields.

## 16. filter.advanced
- **Type**: string
- **Examples**: `AREA[StartDate]2022`, `AREA[MinimumAge]RANGE[MIN, 16 years] AND AREA[MaximumAge]RANGE[16 years, MAX]`
- **Description**:
  - Filter by query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).

## 17. filter.synonyms
- **Type**: array of string
- **Example**: `[ConditionSearch:1651367, BasicSearch:2013558]`
- **Description**:
  - Filter by comma- or pipe-separated list of `area:synonym_id` pairs.

## 18. postFilter.overallStatus
- **Type**: array of string
- **Allowed Values**: `ACTIVE_NOT_RECRUITING`, `COMPLETED`, `ENROLLING_BY_INVITATION`, `NOT_YET_RECRUITING`, `RECRUITING`, `SUSPENDED`, `TERMINATED`, `WITHDRAWN`, `AVAILABLE`, `NO_LONGER_AVAILABLE`, `TEMPORARILY_NOT_AVAILABLE`, `APPROVED_FOR_MARKETING`, `WITHHELD`, `UNKNOWN`
- **Examples**: `[NOT_YET_RECRUITING, RECRUITING]`, `[COMPLETED]`
- **Description**:
  - Filter by comma- or pipe-separated list of statuses.

## 19. postFilter.geo
- **Type**: string
- **Pattern**: `^distance\(-?\d+(\.\d+)?,-?\d+(\.\d+)?,\d+(\.\d+)?(km|mi)?\)$`
- **Example**: `distance(39.0035707,-77.1013313,50mi)`
- **Description**:
  - Filter by geo-function. Currently, only the distance function is supported.
  - Format: `distance(latitude,longitude,distance)`.

## 20. postFilter.ids
- **Type**: array of string
- **Example**: `[NCT04852770, NCT01728545, NCT02109302]`
- **Description**:
  - Filter by comma- or pipe-separated list of NCT IDs (a.k.a. ClinicalTrials.gov identifiers).
  - The provided IDs will be searched in [NCTId](/data-api/about-api/study-data-structure#NCTId) and [NCTIdAlias](/data-api/about-api/study-data-structure#NCTIdAlias) fields.

## 21. postFilter.advanced
- **Type**: string
- **Examples**: `AREA[StartDate]2022`, `AREA[MinimumAge]RANGE[MIN, 16 years] AND AREA[MaximumAge]RANGE[16 years, MAX]`
- **Description**:
  - Filter by query in [Essie expression syntax](/find-studies/constructing-complex-search-queries).

## 22. postFilter.synonyms
- **Type**: array of string
- **Example**: `[ConditionSearch:1651367, BasicSearch:2013558]`
- **Description**:
  - Filter by comma- or pipe-separated list of `area:synonym_id` pairs.

## 23. aggFilters
- **Type**: string
- **Examples**: `results:with,status:com`, `status:not rec,sex:f,healthy:y`
- **Description**:
  - Apply aggregation filters; aggregation counts will not be provided.
  - The value is a comma- or pipe-separated list of pairs `filter_id:space-separated list of option keys` for the checked options.

## 24. geoDecay
- **Type**: string
- **Default**: `func:exp,scale:300mi,offset:0mi,decay:0.5`
- **Pattern**: `^func:(gauss|exp|linear),scale:(\d+(\.\d+)?(km|mi)),offset:(\d+(\.\d+)?(km|mi)),decay:(\d+(\.\d+)?)$`
- **Examples**: `func:linear,scale:100km,offset:10km,decay:0.1`, `func:gauss,scale:500mi,offset:0mi,decay:0.3`
- **Description**:
  - Set proximity factor by distance from `filter.geo` location to the closest [LocationGeoPoint](/data-api/about-api/study-data-structure#LocationGeoPoint) of a study.
  - Ignored if `filter.geo` parameter is not set or the response contains more than 10,000 studies.

## 25. fields
- **Type**: array of string
- **Constraint**: Minimum 1 item
- **Examples**: `[NCTId, BriefTitle, OverallStatus, HasResults]`, `[ProtocolSection]`
- **Description**:
  - If specified, must be a non-empty comma- or pipe-separated list of fields to return. If unspecified, all fields will be returned. Order of the fields does not matter.
  - For `csv` format, specify a list of columns. Column names are available on [CSV Download](/data-api/about-api/csv-download).
  - For `json` format, every list item is either an area name, piece name, field name, or special name. If a piece or field is a branch node, all descendant fields will be included. All area names are available on [Search Areas](/data-api/about-api/search-areas), piece and field names on [Data Structure](/data-api/about-api/study-data-structure), and can also be retrieved at `/studies/metadata` endpoint. The special name `@query` expands to all fields queried by search.

## 26. sort
- **Type**: array of string
- **Constraint**: Maximum 2 items
- **Examples**: `[@relevance]`, `[LastUpdatePostDate]`, `[EnrollmentCount:desc, NumArmGroups]`
- **Description**:
  - Comma- or pipe-separated list of sorting options for studies. Studies are not sorted by default for performance reasons.
  - Every list item contains a field/piece name and an optional sort direction (`asc` for ascending or `desc` for descending) after a colon.
  - All piece and field names can be found on [Data Structure](/data-api/about-api/study-data-structure) and retrieved at `/studies/metadata` endpoint. Currently, only date and numeric fields are allowed for sorting.
  - The special "field" `@relevance` sorts by relevance to a search query.
  - Studies missing the sort field are always last.
  - Default sort direction:
    - Date field: `desc`
    - Numeric field: `asc`
    - `@relevance`: `desc`

## 27. countTotal
- **Type**: boolean
- **Default**: `false`
- **Description**:
  - If `true`, counts the total number of studies across all pages and returns the `totalCount` field with the first page.
  - For CSV, the result can be found in the `x-total-count` response header.
  - The parameter is ignored for subsequent pages.

## 28. pageSize
- **Type**: int32
- **Default**: `10`
- **Constraint**: Minimum 0
- **Examples**: `2`, `100`
- **Description**:
  - Page size is the maximum number of studies to return in the response. It does not have to be the same for every page.
  - If not specified or set to 0, the default value will be used. It will be coerced down to 1,000 if greater than that.

## 29. pageToken
- **Type**: string
- **Description**:
  - Token to get the next page. Set it to a `nextPageToken` value returned with the previous page in JSON format.
  - For CSV, it can be found in the `x-next-page-token` response header.
  - Do not specify it for the first page.