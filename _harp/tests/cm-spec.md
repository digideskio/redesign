
**Status:** WORKING DRAFT 3.0 Specification

**This Version**

* <http://open-services.net/wiki/change-management/Specification-3.0/>

**Latest Version** 

* <http://open-services.net/wiki/change-management/Specification-3.0/>

**PreviousVersion** 

* <http://open-services.net/bin/view/Main/CmSpecificationV2>

**Authors** 

* [SteveSpeicher](http://open-services.net/bin/view/Main/SteveSpeicher)
* [SamPadgett](http://open-services.net/bin/view/Main/SamPadgett)

**Contributors** 

* See [Contributors section](#Contributors) below

**Table of Contents**

[TOC]

**Notation and Conventions**

The key words &ldquo;MUST&rdquo;, &ldquo;MUST NOT&rdquo;, &ldquo;REQUIRED&rdquo;, &ldquo;SHALL&rdquo;, &ldquo;SHALL NOT&rdquo;, &ldquo;SHOULD&rdquo;, &ldquo;SHOULD NOT&rdquo;, &ldquo;RECOMMENDED&rdquo;, &ldquo;MAY&rdquo;, and &ldquo;OPTIONAL&rdquo; in this document are to be interpreted as described in [RFC2119](http://www.ietf.org/rfc/rfc2119.txt). Domain name examples use [RFC2606](http://tools.ietf.org/html/rfc2606).

## Example

really just needed another example


Introduction
-------------

(this section is informative)

This specification defines a RESTful web services interface for Change Management, the management of product change requests, activities, tasks and relationships between those and related resources such as project, category, release and plan. To support these scenarios, this specification defines a set of HTTP-based RESTful interfaces in terms of HTTP methods: GET, POST, PUT and DELETE, HTTP response codes, content type handling and resource formats.

The intent of this specification is to define the capabilities needed to support integration scenarios defined by the Change Management working group and not to provide a comprehensive interface to Change Management. The resource formats and operations may not match exactly the native models supported by change management service providers but are intended to be compatible with them. The approach to supporting these scenarios is to delegate operations, as driven by service provider contributed user interfaces, as much as possible and not require a service provider to expose its complete data model and application logic.

The following figure illustrates how this CM specification relates to other OSLC specifications. It extends and restricts the OSLC Core, while referencing resources defined in other domain specifications.

**NEEDS UPDATE**: The diagram does not show new change management resource types like oslc_cm:Defect or oslc_cm:Task.

![OSLC-CM Relationship to other OSLC Specifications](http://open-services.net/pub/Main/CmSpecificationV2/cm-relationships.png)


### Terminology

**Change Request Resource** - A request for change to an application or product. Typically a product request for enhancement, a report for a resolution of a product defect or simply a bug report.

**Consumer** - an implementation of the OSLC Change Management specifications as a client. OSLC CM Consumers consume services provided by service providers

**Service Provider** - an implementation of the OSLC Change Management specifications as a server. OSLC CM clients consume these services


<h1 class="godzilla">Throw a Godzilla</h1>


Base Requirements
------------------


### Compliance

**NEEDS UPDATE**: Will be based on OSLC Core 3.0. Currently links to the OSLC Core 2.0 specification.

This specification is based on [OSLC Core Specification](http://open-services.net/bin/view/Main/OslcCoreSpecification). OSLC CM consumers and service providers **MUST** be compliant with both the core specification and this CM specification, and SHOULD follow all the guidelines and recommendations in both these specifications.

The following table summarizes the requirements from OSLC Core Specification as well as some additional specific to CM. Note that this specification further restricts some of the requirements for OSLC Core Specification. See further sections in this specification or the OSLC Core Specification to get further details on each of these requirements.

**NEEDS UPDATE**: Review content of this table based on what will change in OSLC Core 3.0. For instance, the requirement level for different media types will probably change. See Resource Formats below.

Requirement | Level | Meaning
----------- | ----- | -------
Unknown properties and content | MAY / MUST | OSLC services MAY ignore unknown content and OSLC clients MUST preserve unknown content
Resource Operations | MUST | OSLC service MUST support resource operations via standard HTTP operations
Resource Paging | MAY | OSLC services MAY provide paging for resources but only when specifically requested by client
Partial Resource Representations | MAY / MUST | OSLC services MUST support request for a subset of a resource's properties via the oslc.properties URL parameter retrieval via HTTP GET and MAY support via HTTP PUT
Partial Update | MAY | OSLC services MAY support partial update of resources using patch semantics
Service Provider Resources | MAY / MUST | OSLC service providers MAY provide a Service Provider Catalog and MUST provide a Service Provider resource
Creation Factories | MUST | OSLC service providers MUST provide creation factories to enable resource creation via HTTP POST
Query Capabilities | MUST | OSLC service providers MUST provide query capabilities to enable clients to query for resources
Query Syntax | MUST | OSLC query capabilities MUST support the OSLC Core Query Syntax and MAY use other query syntax
Delegated UI Dialogs | MUST | OSLC Services MUST offer delegated UI dialogs (creation and selections) specified via service provider resource
UI Preview | SHOULD | OSLC Services SHOULD offer UI previews for resources that may be referenced by other resources
HTTP Basic Authentication | MAY | OSLC Services MAY support Basic Auth and should do so only over HTTPS
OAuth Authentication | SHOULD | OSLC Services SHOULD support OAuth and can indicate the required OAuth URLs via the service provider resource
Error Responses | MAY | OSLC Services MAY provide error responses using Core defined error formats
RDF/XML Representations | MUST / SHOULD | OSLC services MUST provide an RDF/XML representation for HTTP GET requests and SHOULD support RDF/XML representations on POST and PUT requests.
XML Representations | MUST | OSLC services MUST provide a XML representation for HTTP GET, POST and PUT requests that conform to the Core Guidelines for XML.
JSON Representations | MUST | OSLC services MUST provide JSON representations for HTTP GET, POST and PUT requests that conform to the Core Guidelines for JSON
HTML Representations | SHOULD | OSLC services SHOULD provide HTML representations for HTTP GET requests



### Specification Versioning

**NEEDS UPDATE**: Do we still need an OSLC-Core-Version header? Need guidance from OSLC Core. Compatibility with Core V2 is planned for Core V3.

See [OSLC Core Specification Versioning section](http://open-services.net/bin/view/Main/OslcCoreSpecification#Specification_Versioning).

Service providers that support the resource formats and services in this specification **MUST** use HTTP response header of `OSLC-Core-Version` with a value of `3.0`. Consumers **MAY** request formats and services defined in this document by providing a HTTP request header of `OSLC-Core-Version` with a value of `3.0`. See section below on Version Compatibility with OSLC CM 1.0 Specifications.


### Namespaces

In addition to the namespace URIs and namespace prefixes `oslc`, `rdf`, `dcterms` and `foaf` defined in the [OSLC Core specification](http://open-services.net/bin/view/Main/OslcCoreSpecification), OSLC CM defines the namespace URI of `http://open-services.net/ns/cm#` with a namespace prefix of `oslc_cm`

This specification also uses these namespace prefix definitions:

* oslc_rm : `http://open-services.net/ns/rm#` (Reference: OSLC RM)
* oslc_qm : `http://open-services.net/ns/qm#` (Reference: OSLC QM)
* oslc_scm : `http://open-services.net/ns/scm#` (Reference: OSLC SCM)


### Resource Formats

**NEEDS UPDATE**: Evaluate JSON-LD in place of OSLC JSON. Add Turtle? Remove Atom? Need guidance from OSLC Core.

In addition to the requirements for [OSLC Core Resource Formats section](http://open-services.net/bin/view/Main/OslcCoreSpecification#Resource_Formats), this section outlines further refinements and restrictions.

For HTTP GET requests on all OSLC CM and OSLC Core defined resource types,

* CM Providers **MUST** provide RDF/XML, XML. and JSON representations. The XML and JSON representations **SHOULD** follow the guidelines outlined in the [OSLC Core Representations Guidance](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations).
* CM Consumers requesting RDF/XML **SHOULD** be prepared for any valid RDF/XML document. CM Consumers requesting XML or JSON **SHOULD** be prepared for representations that follow the guidelines outlined in the [OSLC Core Representations Guidance](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations).
* CM Providers **SHOULD** support an [X]HTML representation and a user interface (UI) preview as defined by [UI Preview Guidance](http://open-services.net/bin/view/Main/OslcCoreUiPreview)

For HTTP PUT/POST request formats for resource type of !ChangeRequest:

* CM Providers **MUST** accept XML and JSON representations and **SHOULD** accept RDF/XML representations. CM Providers accepting RDF/XML **SHOULD** be prepared for any valid RDF/XML document. For XML or JSON, CM Providers **SHOULD** be prepared for representations that follow the guidelines outlined in the [OSLC Core Representations Guidance](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations).

For HTTP GET response formats for Query requests,

CM Providers MUST provide RDF/XML, XML, Atom Syndication Format XML and JSON representations.

When CM Consumers request:

* `application/rdf+xml` CM Providers **MUST** respond with RDF/XML representation without restrictions.
* `application/json` CM Providers **MUST** respond with JSON representation as defined in the [OSLC Core Representations Guidance](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations).
* `application/xml` CM Provider **MUST** respond with OSLC-defined abbreviated XML representation as defined in the [OSLC Core Representations Guidance](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations)
* `application/atom+xml` CM Provider **MUST** respond with Atom Syndication Format XML representation as defined in the [OSLC Core Representations Guidance](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations)
* The Atom Syndication Format XML representation **SHOULD** use RDF/XML representation without restrictions for the atom:content entries representing the resource representations.

See Query Capabilities for additional information when Resource Shapes affect representation.


#### Content Negotiation

**NEEDS UPDATE**: Resource formats are expected to change. Remove this section and defer to OSLC Core?

OSLC Core Guidance clearly points to RDF representations (and specifically RDF/XML) as a convention that all OSLC Provider implementations minimally provide and accept. OSLC CM Provider implementations are strongly encouraged to adopt this convention. Future versions of this specification are expected to require RDF representations for all operations and relax requirements for specialized XML representations.

**Representation** - identified by the `application/xml` content type. Format representation rules are outlined in Core [OSLC Core Resource Formats section](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations)

**XML Representation** - identified by the `application/xml` content type. Format representation rules are outlined in Core [OSLC Core Resource Formats section](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations)

**RDF/XML Representation** - identified by the `application/rdf+xml` content type. No additional guidance is given. The OSLC Core describes an algorithm for generating consistent formats that are used as examples only.

**JSON Representation** - identified by the `application/json` content type. Format representation rules are outlined in Core [OSLC Core Resource Formats section](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations).

**Atom Syndication Format XML Representation** - identified by the `application/atom+xml` content type. Format representation rules are outlined in Core [OSLC Core Resource Formats section](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations).


### Authentication

**NEEDS UPDATE**: Adopt authentication requirements and recommendations from OSLC Core 3.0.

See [OSLC Core Authentication section](http://open-services.net/bin/view/Main/OslcCoreSpecification#Authentication). In addition to the OSLC Core authentication requirements, OSLC CM services providers **SHOULD** support OAuth.


### Error Responses

See [OSLC Core Error Responses section](http://open-services.net/bin/view/Main/OslcCoreSpecification#Error_Responses). OSLC CM puts no additional constraints on error responses.


### Pagination

OSLC CM service providers **SHOULD** support pagination of query results and **MAY** support pagination of a single resource's properties as defined by the OSLC Core Specification.


### Requesting and Updating Properties


#### Requesting a Subset of Properties

A client **MAY** request a subset of a resource's properties as well as properties from a referenced resource. In order to support this behavior a service provider **MUST** support the `oslc.properties` and `oslc.prefix` URL parameter on a HTTP GET request on individual resource request or a collection of resources by query. If the `oslc.properties` parameter is omitted on the request, then all resource properties **MUST** be provided in the response.


#### Updating a Subset of Properties

**NEEDS UPDATE**: Adopt partial update (PATCH) from W3C LDP.

A client **MAY** request that a subset of a resource's properties be updated by identifying those properties to be modified using the `oslc.properties` URL parameter on a HTTP PUT request.

If the parameter `oslc.properties` contains a valid resource property on the request that is not provided in the content, the server **MUST** set the resource's property to a null or empty value. If the parameter `oslc.properties` contains an invalid resource property, then a `409 Conflict` **MUST** be returned.


#### Updating Multi-Valued Properties

For multi-valued properties that contain a large number of values, it may be difficult and inefficient to add or remove property values. OSLC CM Service Providers **SHOULD** provide support for a partial update of the multi-valued properties as defined by [OSLC Core Partial Update](http://open-services.net/bin/view/Main/OslcCorePartialUpdate).


### Labels for Relationships

Change Management relationships to other resources are represented by RDF properties. Instances of a relationship - often called links - are RDF triples whose predicate is the property, and whose value (aka object) is the URI of target resource. When a Change Management link is to be presented in a user interface, it may be helpful to display an informative and useful textual label instead of or in addition to the URI. It is recommended to use either a property from the target resource such as 
dcterms:title or retrieve a label for presentation by retrieving the target resource's [OSLCUIPreview](http://open-services.net/bin/view/Main/http://open-services.net/bin/view/Main/OslcCoreUiPreview).  In the case where a relationship (a triple) requires a unique label that is not available from the target resource, only then OSLC providers **MAY** support a `dcterms:title` link property in Change Management resource representations, using the anchor approach outlined in the OSLC Core Links Guidance.

**NEEDS UPDATE**: Provide Turtle example.

RDF/XML and XML example using reified statement:

~~~
<rdf:RDF 
     xmlns:dcterms="http://purl.org/dc/terms/" 
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:oslc_cm="http://open-services.net/ns/cm#">

    <oslc_cm:ChangeRequest rdf:about="http://example.com/bugs/4321">
         <oslc_cm:relatedChangeRequest rdf:ID="link1"
             rdf:resource="http://anotherexample.com/defects/123" />
    </oslc_cm:ChangeRequest>

    <rdf:Description rdf:about="#link1">
        <dcterms:title>Defect 123: Problems during install</dcterms:title>
   </rdf:Description>
</rdf:RDF>
~~~

**NEEDS UPDATE**: Will this be JSON-LD in 3.0?

JSON example using reified statement:

~~~
{  
   "prefixes" : {
      "dcterms"  : "http://purl.org/dc/terms/",
      "rdf"      : "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "oslc"     : "http://open-services.net/ns/core#",
      "oslc_cm"  : "http://open-services.net/ns/cm#"
   },
   "rdf:type" : [ { "rdf:resource" : "http://open-services.net/ns/cm#ChangeRequest" }],
   "rdf:about" : "http://example.com/bugs/4321",
   "oslc_cm:relatedChangeRequest" : { 
       "rdf:resource"  : "http://anotherexample.com/defects/123",
       "dcterms:title" : "Defect 123: Problems during install"
   }
}
~~~

### Actions   {#Actions}

**NEEDS UPDATE**: The following is the OSLC-CM workgroup design for actions. The workgroup is evaluating instead using the OSLC Core actions proposal, [Exposing arbitrary actions on RDF resources](http://open-services.net/wiki/core/Exposing-arbitrary-actions-on-RDF-resources/).

Actions are read-only properties of type Resource in a Change Request resource. The URI of such a reference property ("Action URI") points to the [Action resource](#Resource_Action) that handles the state transition. A resource can be updated by a HTTP POST to the Action URI. The request body of the HTTP POST **MUST** contain the resource URI that the transition will be applied. The request body **MAY** contain additional property values to be updated along with the state transition via the action. A HTTP GET on the Action URI **SHOULD** return information about that action.

The Change Request resource representation **SHOULD** only include the actions that are applicable to the current state of the resource. If an action is performed and the precondition for a state transition is not met, the request **MUST** respond with a 409 Conflict status code.

An attempt to update an action property explicitly in a PUT or PATCH request **SHOULD** be answered with a 409 Conflict HTTP status code. Their presence in a resource representation used for an update via PUT **MUST NOT** prevent the resource from being updated.

#### Example

A change request resource representation with actions and predicates:

~~~
@prefix oslc: <http://open-services.net/ns/core#>.
@prefix oslc_cm: <http://open-services.net/ns/cm#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix dcterms: <http://purl.org/dc/terms/>.
<http://example.com/bugs/2314>
   a oslc_cm:ChangeRequest;
   oslc_cm:state <http://open-services.net/ns/cm#Open-state>;
   dcterms:identifier "2314";
   dcterms:title "Provide import";
   oslc_cm:action <http://example.com/bugs/action/resolve>,
                  <http://example.com/bugs/action/start>.

<http://example.com/bugs/action/resolve>
   a oslc_cm:Action;
   dcterms:description "Indicates work is complete on the change request.";
   dcterms:identifier "23";
   dcterms:title "Resolve";
   oslc:resourceShape <http://example.com/bugs/action/resolve/shape>;
   oslc_cm:targetState <http://open-services.net/ns/cm#Resolved-state>.

<http://example.com/bugs/action/start> 
   a oslc_cm:Action;
   dcterms:description "Indicates work is beginning on the change request.";
   dcterms:identifier "24";
   dcterms:title "Start Working";
   oslc:resourceShape <http://example.com/bugs/action/start/shape>;
   oslc_cm:targetState <http://open-services.net/ns/cm#In-progress-state>.
~~~

To change the CR's state to 'In Progress', you would transition the CR by POST'ing to the `oslc_cm:action` URL for the right target state:

~~~
POST /bugs/action/start HTTP/1.1
@prefix oslc_cm: <http://open-services.net/ns/cm#>.
<http://example.com/bugs/2314>
   a oslc_cm:ChangeRequest.
~~~

After the request, the CR resource representation will look like

~~~
@prefix xmlns: <http://www.w3.org/2000/xmlns/>.
@prefix oslc_cm: <http://open-services.net/ns/cm#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix dcterms: <http://purl.org/dc/terms/>.
<http://example.com/bugs/2314> 
  a oslc_cm:ChangeRequest;
  oslc_cm:state <http://open-services.net/ns/cm#In-progress-state>;
  dcterms:identifier "2314";
  dcterms:title "Provide import";
  oslc_cm:action <http://example.com/bugs/action/resolve>.
~~~

A GET on an action URI might look like this.

~~~
GET /bugs/action/resolve HTTP/1.1
@prefix oslc: <http://open-services.net/ns/core#>.
@prefix oslc_cm: <http://open-services.net/ns/cm#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix dcterms: <http://purl.org/dc/terms/>.

<http://example.com/bugs/action/resolve>
   a oslc_cm:Action;
   dcterms:description "Indicates work is complete on the change request.";
   dcterms:identifier "23";
   dcterms:title "Resolve";
   oslc:resourceShape <http://example.com/bugs/action/resolve/shape>;
   oslc_cm:targetState <http://open-services.net/ns/cm#Resolved-state>.
~~~

### Attachments

An attachment is added to a ChangeRequest via a simple POST request to the appropriate LDP-Container resource. The entity body becomes the content of the attachment resource. The attachment is automatically associated with the Change Request via an `oslc_cm:attachment` statement. Statements are also automatically added to the `oslc_cm:AttachmentDescriptor` resource. The property values are assigned by the CM provider or can be determined from standard headers of the POST.  The following table maps the HTTP request headers from the POST request to create the attachment resource to what SHOULD be used as the initial values in the indicated `oslc_cm:AttachmentDescriptor` resource:

| **HTTP Request Header** | **Prefixed Name**
| ----------------------- | -------------------
| `Slug` [RFC5023](http://tools.ietf.org/html/rfc5023#section-9.7) | `dcterms:title`
| `Content-Type` | `dcterms:format`
| `Content-Length` | `oslc_cm:attachmentSize`

When a CM Provider successfully creates an attachment resource, it MUST respond with an HTTP status code of 201 (created) with the URI of the newly created attachment resource in the HTTP response `Location` header.  Additional, if the CM Provider created an associated `oslc_cm:AttachmentDescriptor` resource, the URI for this resource should be listed in the HTTP response `Link` header with `rel= describes` see [RFC5988](http://tools.ietf.org/html/rfc5988) and [RFC6892](http://tools.ietf.org/html/rfc6892).

A CM consumer can include an `Slug` header in the attachment-creating POST to specify a hint for a name for the resource as part of that single request. This can be important as some CM systems require a name at the time the attachment is created. Different systems may have different requirements for valid attachment names, so the value of the `Slug` header should be interpreted as a hint in this context. If the given name can not be used as specified, it SHOULD be transformed into a valid name. If that is not possible or the header is not specified, an arbitrary value SHOULD be assigned. Failure due to an invalid name is undesirable because of the potentially large size of an attachment resource.

An `Slug` header SHOULD also be included by a CM provider in the response to a GET on an attachment resource. If a consumer wishes to store the content as a file, this value provides a hint as to the file name to use (subject, of course, to any file system restrictions). In the absence of an `Slug` header, the consumer may use the last segment of the resource's URI as a hint, or just choose an arbitrary file name.

#### Example

##### Retrieve an Attachment for a Change Request

This involves two GET requests (if you don't have the attachment URI available and do have the Change Request's URI): the first to find the URI of ChangeRequest, the second is it fetch the attachment itself (based on the Change Request's property values).

**Request #1**

~~~
GET http://example.com/bugs/2314?oslc.properties=oslc_cm:attachment
Accept: text/turtle
~~~

**Response #1**

~~~
HTTP/1.1 200 OK
Content-Type: text/turtle
Content-Length: 183
ETag: "_87e52ce291112"

@prefix oslc_cm: <http://open-services.net/ns/cm#> .
@prefix ldp: <http://w3.org/ns/ldp#> .

<>
   a oslc_cm:ChangeRequest ;
   oslc_cm:attachment
      <attachments/1>,
      <attachments/2> .

<attachments>
   a ldp:Container;
   ldp:membershipPredicate oslc_cm:attachment;
   ldp:membershipSubject <.>.
~~~

**Request #2**

~~~
GET http://example.com/bugs/2314/attachments/1
Accept: */*
~~~

**Response #2**

~~~
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 53622
Link: <http://example.com/bugs/2314/attachments/meta/1>;rel=describes
ETag: "_87e52ce295556"

[binary content]
~~~

##### Fetch Attachment container


**Request**

~~~
GET http://example.com/bugs/2314/attachments
Accept: text/turtle
~~~

**Response**

~~~
HTTP/1.1 200 OK
Content-Type: text/turtle
Content-Length: 944
ETag: "_87e52ce293334"

@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix oslc_cm: <http://open-services.net/ns/cm#> .
@prefix ldp: <http://w3.org/ns/ldp#> .
@prefix wdrs: <http://www.w3.org/2007/05/powder-s#> .

<>
   a ldp:Container ;
   ldp:membershipPredicate oslc_cm:attachment;
   ldp:membershipSubject <http://example.com/bugs/2314>.

<http://example.com/bugs/2314>
   oslc_cm:attachment <1>, <2> .

<http://example.com/bugs/2314/attachments/meta/1>
   a oslc_cm:AttachmentDescriptor ;
   dcterms:title "screenshot.png" ;
   dcterms:identifier "1" ;
   dcterms:format <http://purl.org/NET/mediatypes/image/png> ;
   oslc_cm:attachmentSize "53622" ;
   dcterms:creator <http://example.com/users/steve> ;
   dcterms:created "2011-07-18T13:22:30.45-05:00" .

<http://example.com/bugs/2314/attachments/1> wdrs:describedBy <http://example.com/bugs/2314/attachments/meta/1>.

<http://example.com/bugs/2314/attachments/meta/2>
   a oslc_cm:AttachmentDescriptor ;
   dcterms:title "fix.patch" ;
   dcterms:identifier "2" ;
   dcterms:format <http://purl.org/NET/mediatypes/text/x-diff> ;
   oslc_cm:attachmentSize "9196" ;
   dcterms:creator <http://example.com/users/dave> ;
   dcterms:created "2011-07-19T15:03:54.00-05:00" .

<http://example.com/bugs/2314/attachments/2> wdrs:describedBy <http://example.com/bugs/2314/attachments/meta/2>.
~~~

##### Create an Attachment

Once the attachment container URI for a Change Request is known, this is accomplished with a single POST request.

**Request**

~~~
POST http://example.com/bugs/2314/attachments
Slug: design.odt
Content-Type: application/vnd.oasis.opendocument.text
Content-Length: 18124

[binary content]
~~~

**Response**

~~~
HTTP/1.1 201 CREATED
Location: http://example.com/bugs/2314/attachments/3
Link: <http://example.com/bugs/2314/attachments/meta/3>; rel="describes"
Content-Length: 0

~~~


CM Resource Definitions
------------------------

Property value types that are not defined in the following sections, are defined in [OSLC Core - Defining OSLC Properties](http://open-services.net/bin/view/Main/OslcCoreSpecification#Defining_OSLC_Properties)

**NEEDS UPDATE**: Define what properties belong to each type and how the new OSLC-CM types relate to ChangeRequest.

### Resource: Defect

A software or product defect. Used by QM tools to report defects in testing.

* **Name:** `Defect`
* **Type URI** `http://open-services.net/ns/cm#Defect`

### Resource: Enhancement

A request for new functionality.

* **Name:** `Enhancement`
* **Type URI** `http://open-services.net/ns/cm#Enhancement`

### Resource: ReviewTask

A request to make a changes and review the change. A review task can be used by RM tools [to request and approve changes to requirements](http://open-services.net/wiki/change-management/Change-Management-of-Requirements/), or it might be used by QM tools to review test plans and test cases.

* **Name:** `ReviewTask`
* **Type URI** `http://open-services.net/ns/cm#ReviewTask`

### Resource: Task

An executable and trackable activity. Tasks can be used in many context. A QM tool that create tasks to write test plans and test cases is one example.

* **Name:** `Task`
* **Type URI** `http://open-services.net/ns/cm#Task`

### Resource ChangeRequest   {#Resource_ChangeRequest}

The Change Request resource is a single definition used to define many kinds of change requests such as: defect, enhancement, task, bug, activity, etc. There are a fair number of common properties between these different kinds of change requests and can use some of the properties in the follow definition to identify them.

The Change Request resource properties are not limited to the ones defined in this specification, service providers may provide additional properties. It is recommended that any additional properties exist in their own unique namespace and not use the namespaces defined in these specifications.

* **Name:** `ChangeRequest`
* **Type URI** `http://open-services.net/ns/cm#ChangeRequest`

| **Prefixed Name** | **Occurs** | **Read-only** | **Value-type** | **Representation** | **Range** | **Description**
| ----------------- | ---------- | ------------- | -------------- | ------------------ | --------- | -------------------
| **OSLC Core:** Common Properties
| oslc:shortTitle | zero-or-one | unspecified | XMLLiteral | n/a | n/a | Short name identifying a resource, often used as an abbreviated identifier for presentation to end-users. SHOULD include only content that is valid inside an XHTML &lt;span&gt; element.
| dcterms:description | zero-or-one | unspecified | XMLLiteral | n/a | n/a | Descriptive text (reference: Dublin Core) about resource represented as rich text in XHTML content. SHOULD include only content that is valid and suitable inside an XHTML &lt;div&gt; element.
| dcterms:title | exactly-one | unspecified | XMLLiteral | n/a | n/a | Title (reference: Dublin Core) or often a single line summary of the resource represented as rich text in XHTML content. SHOULD include only content that is valid and suitable inside an XHTML &lt;div&gt; element.
| dcterms:identifier | exactly-one | True | String | n/a | n/a | A unique identifier for a resource. Assigned by the service provider when a resource is created. Not intended for end-user display.
| dcterms:subject | zero-or-many | False | String | n/a | n/a | Tag or keyword for a resource. Each occurrence of a dcterms:subject property denotes an additional tag for the resource.
| dcterms:creator | zero-or-many | unspecified | Either Resource or Local Resource | Either Reference or Inline | `any` | Creator or creators of resource (reference: Dublin Core). It is likely that the target resource will be a [ `foaf:Person` ](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixA#foaf_Person_Resource) but that is not necessarily the case.
| dcterms:contributor | zero-or-many | unspecified | Either Resource or Local Resource | Either Reference or Inline | `any` | The person(s) who are responsible for the work needed to complete the change request (reference: Dublin Core). It is likely that the target resource will be a [ `foaf:Person` ](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixA#foaf_Person_Resource) but that is not necessarily the case.
| dcterms:created | zero-or-one | True | DateTime | n/a | n/a | Timestamp of resource creation (reference: Dublin Core).
| dcterms:modified | zero-or-one | True | DateTime | n/a | n/a | Timestamp last latest resource modification (reference: Dublin Core).
| rdf:type | zero-or-many | unspecified | Resource | Reference | n/a | The resource type URIs. One of at least has the value of `http://open-services.net/ns/cm#ChangeRequest`
| oslc:serviceProvider | zero-or-many | unspecified | Resource | Reference | [`oslc:ServiceProvider`](http://open-services.net/bin/view/Main/OslcCoreSpecification#Service_Provider_Resources) | The scope of a resource is a URI for the resource's OSLC Service Provider.
| oslc:instanceShape | zero-or-one | unspecified | Resource | Reference | [ `oslc:ResourceShape` ](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixA#oslc_ResourceShape_Resource) | Resource Shape that provides hints as to resource property value-types and allowed values.
| oslc:discussedBy | zero-or-one | unspecified | Resource | Either | [ `oslc:Discussion` ](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixA#oslc_Discussion_Resource) | A series of notes and comments about this change request.
| **Prefixed Name** | **Occurs** | **Read-only** | **Value-type** | **Representation** | **Range** | **Description**
| **OSLC CM:** Start of additional properties
| oslc_cm:closeDate | zero-or-one | true | DateTime | n/a | n/a | The date at which no further activity or work is intended to be conducted.
| oslc_cm:state | zero-or-many | false | Resource | Reference | [`oslc_cm:State`](#Resource_State) | Used to indicate the status of the change request. This property is read-only, but can be changed using [Actions](#Actions).
| oslc_cm:action | zero-or-many | true | Resource | Either | [`oslc_cm:Action`](#Resource_Action) | An action to change the state of this ChangeRequest. See [Actions](#Actions).
| oslc_cm:priority | at-most-one | false | Resource | Either | [`oslc_cm:Priority`](#Resource_Priority) | Priority of this ChangeRequest
| oslc_cm:severity | at-most-one | false | Resource | Either | [`oslc_cm:Severity`](#Resource_Severity) | Severity or criticality of ChangeRequest
| oslc_cm:attachment | zero-or-many | true | Resource | Reference | Resource | Multi-valued property of attachments associated with the Change Request.
| **Prefixed Name** | **Occurs** | **Read-only** | **Value-type** | **Representation** | **Range** | **Description**
| **Relationship properties:** This grouping of properties are used to identify relationships between resources managed by other OSLC Service Providers
| oslc_cm:relatedChangeRequest | zero-or-many | False | Resource | Reference | `any` | This relationship is loosely coupled and has no specific meaning. It is likely that the target resource will be an [`oslc_cm:ChangeRequest`](#Resource_ChangeRequest) but that is not necessarily the case.
| oslc_cm:affectsPlanItem | zero-or-many | False | Resource | Reference | `any` | Change request affects a plan item. It is likely that the target resource will be an [`oslc_cm:ChangeRequest`](#Resource_ChangeRequest) but that is not necessarily the case.
| oslc_cm:affectedByDefect | zero-or-many | False | Resource | Reference | `any` | Change request is affected by a reported defect. It is likely that the target resource will be an [`oslc_cm:ChangeRequest`](#Resource_ChangeRequest) but that is not necessarily the case.
| oslc_cm:tracksRequirement | zero-or-many | False | Resource | Reference | `any` | Tracks the associated Requirement or Requirement !ChangeSet resources. It is likely that the target resource will be an [`oslc_rm:Requirement`](http://open-services.net/bin/view/Main/RmSpecificationV2#Resource_Requirement) but that is not necessarily the case.
| oslc_cm:implementsRequirement | zero-or-many | False | Resource | Reference | `any` | Implements associated Requirement. It is likely that the target resource will be an [`oslc_rm:Requirement`](http://open-services.net/bin/view/Main/RmSpecificationV2#Resource_Requirement) but that is not necessarily the case.
| oslc_cm:affectsRequirement | zero-or-many | False | Resource | Reference | `any` | Change request affecting a Requirement. It is likely that the target resource will be an [`oslc_rm:Requirement`](http://open-services.net/bin/view/Main/RmSpecificationV2#Resource_Requirement) but that is not necessarily the case.
| oslc_cm:tracksChangeSet | zero-or-many | False | Resource | Reference | `any` | Tracks SCM change set resource. It is likely that the target resource will be an [`oslc_scm:ChangeSet`](http://open-services.net/bin/view/Main/ScmSpecV1#ChangeSet) but that is not necessarily the case.

**NEEDS UPDATE**: Is oslc_cm:affectedByDefect an inverse of oslc_cm:affectsPlanItem? Should one be removed?

Naming convention for relationship properties follows this pattern:

* **related** - Identifies a loose relationship between a Change Request and referenced resource. These relationships can be used to name associated resources managed by other service providers.
* **tracks** - Identifies that a Change Request is used to track the lifecycle of referenced resource. From the CM tool perspective, these relationships can be used to track work that needs to be done for referenced resources.
* **affects** - Indicates that the Change Request affects, has been predetermined to have impact, related resource. These property relationships can be used to understand the potential impact of referenced resources.


### Resource State   {#Resource_State}

* **Name:** `State`
* **Type URI** `http://open-services.net/ns/cm#State`

| **Range** | **Description** | 
| --------- | --------------- 
| oslc_cm:Closed | Completely done, no further fixes or fix verification is needed.
| oslc_cm:In-progress | Active work is occurring.
| oslc_cm:Fixed
| oslc_cm:Approved
| oslc_cm:Reviewed
| oslc_cm:Verified | The resolution or the fix is verified.

If a Change Request has oslc_cm:state value oslc_cm:In-progress, it **SHOULD NOT** have oslc_cm:state values oslc_cm:Fixed or oslc_cm:Closed.

### Resource Priority   {#Resource_Priority}

* **Name:** `Priority`
* **Type URI** `http://open-services.net/ns/cm#Priority`

**NEEDS UPDATE**: Improve descriptions.

| **Range** | **Description** | 
| --------- | ---------------
| oslc_cm:High | Highest priority.
| oslc_cm:Medium | It can wait, but not forever.
| oslc_cm:Low | OK if you never get to it.
| oslc_cm:PriorityUnassigned | Intentionally set blank.


### Resource Severity   {#Resource_Severity}

* **Name:** `Severity`
* **Type URI** `http://open-services.net/ns/cm#Severity`

**NEEDS UPDATE**: Improve descriptions.

| **Range** | **Description** |
| --------- | ---------------
| oslc_cm:Blocker | Severe problem. No workaround. Blocks development, test, or usage. 
| oslc_cm:Critical | Severe problem. No workaround.
| oslc_cm:Major | Prevents function from being used. There is a workaround.
| oslc_cm:Normal | Affects non-critical functionality. There is a workaround.
| oslc_cm:Minor | Minimal impact.
| oslc_cm:SeverityUnassigned | Intentionally set blank.

* Providers **MAY** have custom oslc_cm:priority and oslc_cm:severity values.
* Providers **SHOULD** use skos:narrower when custom priority or severity values refine standard values.
* Providers **SHOULD NOT** use owl:sameAs when custom priority or severity values refine standard values.

Priority and severity example:

~~~
@prefix ex: <http://example.com/bugtracker> .
@prefix oslc: <http://open-services.net/ns/core#> .
@prefix oslc_cm: <http://open-services.net/ns/cm#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix skos: <http://www.w3.org/2004/02/skos/core> .

<http://example.com/bugs/2314>
   a oslc_cm:ChangeRequest ;
   dcterms:identifier "00002314" ;
   oslc:shortTitle "Bug 2314" ;
   dcterms:title "Invalid installation instructions" ;
   oslc_cm:priority oslc_cm:High ;
   oslc_cm:severity <http://example.com/enums#S1> .

<http://example.com/enums#S1>
   a oslc_cm:Severity;
   dcterms:title "Severe - HOT" ;
   skos:narrower oslc_cm:Critical ;
   ex:icon <http://example.com/severity/S1.gif>.

~~~

### Resource: Action   {#Resource_Action}

The Action resource specifies information about an action, such as a title and a description. It also can include a resource shape that can be used to give consumers hints about required field values for this action.

* **Name:** `Action`
* **Type URI** `http://open-services.net/ns/cm#Action`

| **Prefixed Name** | **Occurs** | **Read-only** | **Value-type** | **Representation** | **Range** | **Description**
| ----------------- | ----------- | ----------- | --------------- | ------------------ | --------- | -------------------
| **OSLC Core**: Common Properties
| dcterms:title | exactly-one | true | XMLLiteral | N/A | N/A | Title (reference: Dublin Core) of the action
| dcterms:description | zero-or-one | true | XMLLiteral | N/A | N/A | Description (reference: Dublin Core) of the action
| dcterms:identifier | zero-or-one | true | String | N/A | N/A | A unique identifier for an action (reference: Dublin Core). Not intended for end-user display.
| rdf:type | zero-or-many | true | Resource | Reference | N/A | The resource type URIs. One of at least has the value of <http://open-services.net/ns/cm#Action>
| oslc:serviceProvider | zero-or-many | true | Resource | Reference | [oslc:ServiceProvider](http://open-services.net/bin/view/Main/OslcCoreSpecification#Service_Provider_Resources) | The scope of a resource is a URI for the resource's OSLC Service Provider.
| oslc:resourceShape | zero-or-many | true | Resource | Reference | [oslc:ResourceShape](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixA#oslc_ResourceShape_Resource) | Resource Shape that provides hints as to resource property value-types and allowed values.
| **OSLC CM:** Start of additional properties
| oslc_cm:targetState | zero-or-many | true | Resource | Reference | N/A | URI indicating the target state for this action.


### Resource: AttachmentDescriptor  {#Resource_AttachmentDescriptor}

AttachmentDescriptor resource type used to describe the binary resource (or non-LDP-Resource) associated with a particular Change Request.  When a client POSTs an attachment content to a server, the server stores the attachment content and assigns a URI just like any other type of resource creation but it may also create an AttachmentDescriptor resource to contain data about the attachment.

* **Name:** `AttachmentDescriptor`
* **Type URI** `http://open-services.net/ns/cm#AttachmentDescriptor`

There is no restriction on the content of each attachment resource. For example, it could be a photo of a kitten, an installation manual, a log file, or a source code patch. Since the attachment cannot be expected to contain additional client or server supplied data, a typical set of properties for each attachment is included with the AttachmentDescriptor resource itself. Thus, the object of each `oslc_cm:attachment` statement is the binary attachment.  Issuing an HTTP HEAD or GET operation on that binary attachment resource URL should produce an HTTP response with a header value of `Link: rel='meta'` to indicate the URL of the oslc_cm:AttachmentDescriptor resource.  The properties for the AttachmentDescriptor resource are indicated in the table below.

| **Prefixed Name** | **Occurs** | **Read-only** | **Value-type** | **Representation** | **Range** | **Description**
| ----------------- | ----------- | ----------- | --------------- | ------------------ | --------- | -------------------
| `dcterms:title` | zero-or-one | unspecified | String | n/a | n/a | Client-specified file name or title.
| `dcterms:identifier` | zero-or-one | True | String | n/a | n/a | System-assigned identifier.
| `dcterms:format` | zero-or-one | unspecified | Resource | n/a | n/a | MIME type of the attachment content. SHOULD be a [PURL media-type resource](http://mediatypes.appspot.com/).
| `oslc_cm:attachmentSize` | zero-or-one | unspecified | `Integer` | n/a | n/a | Size in bytes of the attachment content.
| `dcterms:creator` | zero-or-many | True | Either Resource or Local Resource | Either Reference or Inline | `any` | Creator or creators of the attachment. Likely a [ `foaf:Person` ](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixA#foaf_Person_Resource), but not necessarily so.
| `dcterms:created` | zero-or-one | True | DateTime | n/a | n/a | Timestamp of attachment creation.
| `dcterms:description` |  zero-or-one | unspecified | XML Literal | n/a | n/a | Descriptive text about the attachment. SHOULD include only content that is valid and suitable inside an XHTML element.
||||| **Inverse properties:** In addition to the properties listed above, whose subject is the oslc_cm:AttachmentDescriptor, the follow properties have it as the object
| `wdrs:describedBy` | zero-or-one | unspecified | Either | n/a | n/a |  to relate the information about the attachment resource.

AttachmentDescriptor properties, that is not read-only, MAY be updated via an HTTP PUT or PATCH operation.


CM Service Provider Capabilities
---------------------------------


### Service Provider Resources

OSLC CM service providers **MUST** provide a [Service Provider Resource](http://open-services.net/bin/view/Main/OslcCoreSpecification#Service_Provider_Resources) that can be retrieved at a implementation dependent URI.

OSLC CM service providers **MAY** provide a [Service Provider Catalog Resource](http://open-services.net/bin/view/Main/OslcCoreSpecification#Service_Provider_Catalog_Resources) that can be retrieved at a implementation dependent URI.

OSLC CM service providers **MAY** provide a `oslc:serviceProvider` property for their defined resources that will be the URI to a [Service Provider Resource](http://open-services.net/bin/view/Main/OslcCoreSpecification#Service_Provider_Resources).

OSLC CM service providers **MUST** supply a value of `http://open-services.net/ns/cm#` for the property `oslc:domain` on either `oslc:Service` or `oslc:ServiceProviderCatalog` resources.


### Creation Factories

OSLC CM service providers **MUST** support [Creation Factories](http://open-services.net/bin/view/Main/OslcCoreSpecification#Creation_Factories) and list them in the Service Provider Resource as defined by OSLC Core. OSLC CM service providers **SHOULD** support [Resource Shapes for Creation Factories](http://open-services.net/bin/view/Main/OslcCoreSpecification#Resource_Shapes) as defined in [OSLC Core Specification](http://open-services.net/bin/view/Main/OslcCoreSpecification#Resource_Shapes)


### Query Capabilities

**NEEDS UPDATE**: Decide what to do for query in 3.0.

OSLC CM service providers **MUST** support the [Query Capabilities](http://open-services.net/bin/view/Main/OslcCoreSpecification#Query_Capabilities) as defined by OSLC Core. OSLC CM service providers **SHOULD** support [Resource Shapes for Query Capability](http://open-services.net/bin/view/Main/OslcCoreSpecification#Resource_Shapes) as defined in [OSLC Core Specification](http://open-services.net/bin/view/Main/OslcCoreSpecification#Resource_Shapes)

The Query Capability **MUST** support these parameters:

* `oslc.where`
* `oslc.select`
* `oslc.properties`
* `oslc.prefix`

If shape information is NOT present with the Query Capability, service providers **SHOULD** use these default properties to contain the result:
* For RDF/XML and XML, use `rdf:Description` and `rdfs:member` as defined in [OSLC Core RDF/XML Examples](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations#Specifying_the_shape_of_a_query)
* For JSON, the query results are contained within `oslc:results` array. See [OSLC Core Representation Guidance for JSON](http://open-services.net/bin/view/Main/OSLCCoreSpecAppendixRepresentations#Guidelines_for_JSON)


### Delegated UIs

OSLC CM service providers **MUST** support the selection and creation of resources by delegated web-based user interface dialogs [Delegated UIs](http://open-services.net/bin/view/Main/OslcCoreSpecification#Delegated_User_Interface_Dialogs) as defined by OSLC Core.

OSLC CM service providers **MAY** support the pre-filling of creation dialogs based on the definition at [Delegated UIs](http://open-services.net/bin/view/Main/OslcCoreSpecification#Delegated_User_Interface_Dialogs).


### Usage Identifiers

OSLC CM service provider can identify the usage of various services with additional property values for the [OSLC Core](http://open-services.net/bin/view/Main/OslcCoreSpecification#Service_Provider_Resources) defined `oslc:usage` property on `oslc:Dialog`, `CreationFactory` and `QueryCapability`. The `oslc:usage` property value of `http://open-services.net/ns/core#default` will be used to designate the default or primary service to be used by consumers when multiple entries are found.

The additional property values for `oslc:usage` are:

* `http://open-services.net/ns/cm#defect` - primarily used by QM tools to report defects in testing.
* `http://open-services.net/ns/cm#planItem` - used by QM and PPM tools for associating change requests into plans (project, release, sprint, etc).
* `http://open-services.net/ns/cm#task` - used by QM and PPM tools for associating change requests into executable and track-able items.
* `http://open-services.net/ns/cm#requirementsChangeRequest` - used by RM tools for associating a change request for usage in tracking changes to a Requirements resource


Version Compatibility with 2.0 Specifications
----------------------------------------------

**NEEDS UPDATE**: Need guidance from OSLC Core. (See [Specification Versioning](#Spec_Versioning).)

For additional guidance, a CM 3.0 consumer or provider may reference the `OSLC-Core-Version` HTTP header with a value of `3.0`.


### Deprecated terms

**NEEDS UPDATE**: Move into an appendix.

Since the initial development of the OSLC CM 2.0 specification, there have been a number of properties that are no longer recommended for use and therefore marked as deprecated.  Details about the reason for being marked as such and backwards compatibility items, refer to the [CM 2.0 Issues page](http://open-services.net/wiki/change-management/Issues-2.0/).

| **Prefixed Name** | **Occurs** | **Read-only** | **Value-type** | **Representation** | **Range** | **Description**
| ----------------- | ----------- | ----------- | --------------- | ------------------ | --------- | -------------------
| *deprecated* dcterms:type | zero-or-more | unspecified | String | n/a | n/a | A short string representation for the type, example 'Defect'.
| *deprecated* oslc_cm:status | zero-or-one | unspecified | String | n/a | n/a | Used to indicate the status of the change request based on values defined by the service provider. Most often a read-only property. Some possible values may include: 'Submitted', 'Done', 'InProgress', etc.
| **State predicate properties:** This grouping of properties define a set of computed state predicates, see section on State Predicates for more information. The only restriction on valid state predicate combinations is that if `oslc_cm:inprogress` is `true`, then `oslc_cm:fixed` and `oslc_cm:closed` must also be `false`
| *deprecated* oslc_cm:closed | zero-or-one | True | Boolean | n/a | n/a | Whether or not the Change Request is completely done, no further fixes or fix verification is needed.
| *deprecated* oslc_cm:inprogress | zero-or-one | True | Boolean | n/a | n/a | Whether or not the Change Request in a state indicating that active work is occurring. If `oslc_cm:inprogress` is `true`, then `oslc_cm:fixed` and `oslc_cm:closed` must also be `false`
| *deprecated* oslc_cm:fixed | zero-or-one | True | Boolean | n/a | n/a | Whether or not the Change Request has been fixed.
| *deprecated* oslc_cm:approved | zero-or-one | True | Boolean | n/a | n/a | Whether or not the Change Request has been approved.
| *deprecated* oslc_cm:reviewed | zero-or-one | True | Boolean | n/a | n/a | Whether or not the Change Request has been reviewed.
| *deprecated* oslc_cm:verified | zero-or-one | True | Boolean | n/a | n/a | Whether or not the resolution or fix of the Change Request has been verified.
| **Relationship properties:** This grouping of properties are used to identify relationships between resources managed by other OSLC Service Providers
| *deprecated* oslc_cm:testedByTestCase | zero-or-many | False | Resource | Reference | `any` | Test case by which this change request is tested. It is likely that the target resource will be an `oslc_qm:TestCase`, but that is not necessarily the case.
| *deprecated* oslc_cm:affectsTestResult | zero-or-many | False | Resource | Reference | `any` | Associated QM resource that is affected by this Change Request. It is likely that the target resource will be an `oslc_qm:TestResult`, but that is not necessarily the case.
| *deprecated* oslc_cm:blocksTestExecutionRecord |  zero-or-many | False | Resource | Reference | `any` | Associated QM resource that is blocked by this Change Request. It is likely that the target resource will be an oslc_cm:TestExecutionRecord, but that is not necessarily the case.
| *deprecated* oslc_cm:relatedTestExecutionRecord |  zero-or-many | False | Resource | Reference | `any` | Related to a QM test execution resource. It is likely that the target resource will be an `oslc_qm:TestExecutionRecord`, but that is not necessarily the case.
| *deprecated* oslc_cm:relatedTestCase |  zero-or-many | False | Resource | Reference | `any` | Related QM test case resource. It is likely that the target resource will be an `oslc_qm:TestCase`, but that is not necessarily the case.
| *deprecated* oslc_cm:relatedTestPlan |  zero-or-many | False | Resource | Reference | `any` | Related QM test plan resource. It is likely that the target resource will be an `oslc_qm:TestPlan`, but that is not necessarily the case.
| *deprecated* oslc_cm:relatedTestScript |  zero-or-many | False | Resource | Reference | `any` | Related QM test script resource. It is likely that the target resource will be an `oslc_qm:TestScript`, but that is not necessarily the case.



Appendix A: Samples
--------------------

(this section is informative)

See [[Specification 3.0 Samples]]


Appendix B: Resource Shapes
----------------------------

(this section is informative)

See [[Specification 3.0 Shapes]]


Appendix C: Notices and References
-----------------------------------


### Contributors

* [SteveSpeicher](http://open-services.net/bin/view/Main/SteveSpeicher) (IBM, OSLC-CM Lead)
* [SamPadgett](http://open-services.net/bin/view/Main/SamPadgett) (IBM, OSLC-CM Lead)
* [OlivierBerger](http://open-services.net/bin/view/Main/OlivierBerger) (Institut TELECOM)
* [ScottBosworth](http://open-services.net/bin/view/Main/ScottBosworth) (IBM)
* [GaryDang](http://open-services.net/bin/view/Main/GaryDang) (Accenture)
* [SusanDuncan](http://open-services.net/bin/view/Main/SusanDuncan) (Oracle)
* [RobertElves](http://open-services.net/bin/view/Main/RobertElves) (Tasktop)
* [MatsGothe](http://open-services.net/bin/view/Main/MatsGothe) (IBM)
* [DaveJohnson](http://open-services.net/bin/view/Main/DaveJohnson) (IBM)
* [MikKersten](http://open-services.net/bin/view/Main/MikKersten) (Tasktop)
* [SamLee](http://open-services.net/bin/view/Main/SamLee) (IBM)
* [MarkRinger](http://open-services.net/bin/view/Main/MarkRinger) (Rally)
* [EricSink](http://open-services.net/bin/view/Main/EricSink) (!SourceGear)
* [PatrickStreule](http://open-services.net/bin/view/Main/PatrickStreule) (IBM)
* [MattThomas](http://open-services.net/bin/view/Main/MattThomas) (BSD Group)
* [DenisTyrell](http://open-services.net/bin/view/Main/DenisTyrell) (Oracle)
* [RandyVogel](http://open-services.net/bin/view/Main/RandyVogel) (Accenture)
* [AndreWeinand](http://open-services.net/bin/view/Main/AndreWeinand) (IBM)
* [SofiaYeung](http://open-services.net/bin/view/Main/SofiaYeung) (Oracle)


### Reporting Issues on the Specification

The working group participants who author and maintain this working draft specification, monitor a distribution list where issues or questions can be raised, see [Change Management Mailing List](http://open-services.net/mailman/listinfo/oslc-cm_open-services.net)

Also the issues found with this specification and their resolution can be found at [[Specification 3.0 issues]]


### Intellectual Property Covenant

**NEEDS UPDATE**

The members of the Working Group (or as appropriate, their employers) have documented a Patent Non-Assertion Covenant for implementations of the CM 2.0 Specification, as described in the open-services.net [Terms of Use](http://open-services.net/terms/). Details of the Covenant may be found [here](http://open-services.net/bin/view/Main/CmSpecificationCovenantV2).


### References

* OSLC-CM 1.0 - [OSLC Change Management Specification 1.0](http://open-services.net/bin/view/Main/CmSpecificationV1)
* OSLC-CM 2.0 - [OSLC Change Management Specification 2.0](http://open-services.net/bin/view/Main/CmSpecificationV2)
* OSLC Core - [OSLC Core Specification 2.0](http://open-services.net/bin/view/Main/OslcCoreSpecification)
* OSLC-SCM 1.0 - [OSLC Software Configuration Management Specification 1.0](http://open-services.net/bin/view/Main/ScmSpecV1)
* OSLC-QM 2.0 - [OSLC Quality Management Specification 2.0](http://open-services.net/bin/view/Main/QmSpecificationV2)
* OSLC-RM 2.0 - [OSLC Requirements Management Specification 2.0](http://open-services.net/bin/view/Main/RmSpecificationV2)
* ATOM - [RFC4287 - Atom Syndication Format](http://tools.ietf.org/html/rfc4287)
* Dublin Core 1.1 - [Dublin Core Metadata Element Set, Version 1.1](http://dublincore.org/documents/2010/10/11/dces/)
* FOAF - [Friend of a Friend (FOAF) v0.98](http://xmlns.com/foaf/spec/20100809.html)
* SKOS - [SKOS Simple Knowledge Organization System Reference](http://www.w3.org/TR/skos-reference/)
* HTTP 1.1 - [Hyper-text Transfer Protocol (HTTP/1.1)](http://tools.ietf.org/html/rfc2616)
* JSON - [JavaScript Object Notation](http://json.org/)
* OAuth 1.0a - [RFC5849 - The OAuth 1.0 Protocol](http://tools.ietf.org/html/rfc5849)
* RDF/XML Concepts - [RDF/XML Concepts and Abstract Syntax](http://www.w3.org/TR/2004/REC-rdf-concepts-20040210/)
* RDF/XML Syntax - [RDF / XML Syntax Specification (Revised)](http://www.w3.org/TR/2004/REC-rdf-syntax-grammar-20040210/)
* URI Syntax - [URI Generic Syntax](http://tools.ietf.org/html/rfc3986)
* XML Namespaces - [Namespaces in XML 1.0 (Third Edition)](http://www.w3.org/TR/REC-xml-names/)
* XSD Datatypes - [XML Schema Part 2: Datatypes Second Edition](http://www.w3.org/TR/xmlschema-2)

Appendix D: Changes from 2.0
-----------------------------------

* Added oslc_cm:priority and oslc_cm:severity
* Added state transitions (oslc_cm:action property, oslc_cm:Action resource)
* Added oslc_cm:state. Deprecated oslc_cm:status and state predicates.
* Added Attachments section, oslc_cm:attachment property, and oslc_cm:AttachmentDescriptor
* Added new change management types