<script context="module">
  export function preload(page) {
    const meetupId = page.params.id;
    return this.fetch(`https://svelte-meetup-application-default-rtdb.firebaseio.com/meetups/${meetupId}.json`
      ).then(result => {
          if (!result.ok) {
              throw new Error('Fail to update meet-up data');
          }
          return result.json();
      }).then(data => {
          if (!data) {
              throw new Error('');
          }
          return { meetup: { ...data, id: meetupId}}
      }).catch(() => {
        this.error(404, "No Meet-Up Found :(");
      });
  }
</script>

<script>
    import Button from '../components/UI/Button.svelte'
    export let meetup;
</script>

<style>
  section {
    margin-top: 4rem;
  }

  .image {
    width: 100%;
    height: 25rem;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image {
    background: #e7e7e7;
  }

  .content {
    text-align: center;
    width: 80%;
    margin: auto;
  }

  h1 {
    font-size: 2rem;
    font-family: "Roboto Slab", sans-serif;
    margin: 0.5rem 0;
  }

  h2 {
    font-size: 1.25rem;
    color: #6b6b6b;
  }

  p {
    font-size: 1.5rem;
  }
</style>

<svelte:head>
	<title>{meetup.title} details</title>
</svelte:head>

<section>
    <div class="image">
        <img src={meetup.imageUrl} alt={meetup.title}>
    </div>
    <div class="content">
        <h1>{meetup.title}</h1>
        <h2>{meetup.subTitle}</h2>
        <p>{meetup.description}</p>
        <Button href="mailto:{meetup.email}">Contact</Button>
        <Button cssClass="outline" href="/">Close</Button>
    </div>
</section>