const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const notes = require('./notes');

yargs(hideBin(process.argv))
  .scriptName('notes')
  .usage('$0 <cmd> [opciones]')
  .command({
    command: 'add',
    describe: 'Agrega una nueva nota',
    builder: {
      title: { describe: 'Título', demandOption: true, type: 'string' },
      body:  { describe: 'Contenido', demandOption: true, type: 'string' }
    },
    handler: (argv) => {
      const res = notes.addNote(argv.title, argv.body);
      console.log(res.ok ? `✔ ${res.msg}` : `✖ ${res.msg}`);
    }
  })
  .command({
    command: 'remove',
    describe: 'Elimina una nota por título',
    builder: {
      title: { describe: 'Título', demandOption: true, type: 'string' }
    },
    handler: (argv) => {
      const res = notes.removeNote(argv.title);
      console.log(res.ok ? `✔ ${res.msg}` : `✖ ${res.msg}`);
    }
  })
  .command({
    command: 'list',
    describe: 'Lista todas las notas',
    handler: () => {
      const all = notes.listNotes();
      if (all.length === 0) return console.log('No hay notas.');
      console.log('Notas:');
      all.forEach((n, i) => console.log(`${i + 1}. ${n.title}`));
    }
  })
  .command({
    command: 'read',
    describe: 'Lee una nota por título',
    builder: {
      title: { describe: 'Título', demandOption: true, type: 'string' }
    },
    handler: (argv) => {
      const res = notes.readNote(argv.title);
      if (!res.ok) return console.log(`✖ ${res.msg}`);
      console.log(`Título: ${res.note.title}\nCuerpo: ${res.note.body}`);
    }
  })
  .demandCommand(1, 'Especifica un comando (add, list, read, remove).')
  .strict()
  .help()
  .argv;
