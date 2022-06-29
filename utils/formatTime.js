const { format, formatDistanceToNow } = require('date-fns');

// ----------------------------------------------------------------------

exports.fDate = (date) => {
  return format(new Date(date), 'dd MMMM yyyy');
}

exports.fDateTime = (date) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

exports.fDateTimeSuffix = (date) => {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

exports.fDateTimeSuffixShort = (date) => {
  return format(new Date(date), 'dd-MM-yyyy');
}

exports.fToNow = (date) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}


exports.convertDate = (date) => {
  return new Date(date).toLocaleString(["en-US"], {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}